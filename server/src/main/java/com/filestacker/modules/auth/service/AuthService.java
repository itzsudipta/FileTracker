package com.filestacker.modules.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.filestacker.exception.AppException;
import com.filestacker.modules.auth.dto.*;
import com.filestacker.modules.auth.repository.AuthRepository;
import com.filestacker.modules.organization.entity.Organization;
import com.filestacker.modules.user.entity.User;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.ConnectException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthService {

    private static final long SESSION_SECONDS = 60;

    private final AuthRepository authRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${app.supabase.url:}")
    private String supabaseUrl;

    @Value("${app.supabase.anon-key:}")
    private String supabaseAnonKey;

    @Value("${app.supabase.service-role-key:}")
    private String supabaseServiceRoleKey;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    public AuthService(AuthRepository authRepository, ObjectMapper objectMapper) {
        this.authRepository = authRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().build();
    }

    @PostConstruct
    void check() {
        System.out.println("SERVICE KEY LENGTH: "
                + (supabaseServiceRoleKey == null ? "null" : supabaseServiceRoleKey.length()));
    }

    private void setAuthCookie(HttpServletResponse response, String name, String value, long maxAge) {
        response.addHeader("Set-Cookie", String.format(
                "%s=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=Lax%s",
                name, value, maxAge, cookieSecure ? "; Secure" : ""));
    }

    public void clearAuthCookies(HttpServletResponse response) {
        setAuthCookie(response, "sb-access-token", "", 0);
        setAuthCookie(response, "sb-refresh-token", "", 0);
    }

    public AuthUserResponse getProfile(String email) {
        Optional<User> userOpt = authRepository.findUserByEmail(email);
        if (userOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "User profile not found");
        }
        User user = userOpt.get();
        String orgName = "Unknown Org";
        if (user.getOrgId() != null) {
            Optional<Organization> orgOpt = authRepository.findOrganizationById(user.getOrgId());
            if (orgOpt.isPresent()) {
                orgName = orgOpt.get().getOrgName();
            }
        }
        return new AuthUserResponse(
                user.getUserId().toString(),
                user.getUserName(),
                user.getUserEmail(),
                user.getRole(),
                user.getOrgId() != null ? user.getOrgId().toString() : null,
                orgName
        );
    }

    public AuthResponse login(LoginPayload payload, HttpServletResponse response) {
        JsonNode authData = supabasePasswordLogin(payload.getEmail(), payload.getPassword());
        return completeSignIn("Login successful", payload.getEmail(), authData, response);
    }

    @Transactional
    public AuthResponse register(RegisterPayload payload, HttpServletResponse response) {
        Optional<User> existingLocalUser = authRepository.findUserByEmail(payload.getEmail());
        if (existingLocalUser.isPresent()) {
            throw new AppException(HttpStatus.CONFLICT,
                    "A user with this email address has already been registered");
        }

        JsonNode created;
        try {
            created = supabaseAdminCreateUser(payload.getEmail(), payload.getPassword());
        } catch (AppException exception) {
            if (exception.getStatus() == HttpStatus.UNPROCESSABLE_ENTITY
                    || exception.getMessage().toLowerCase(Locale.ROOT).contains("already")) {
                JsonNode existingAuthUser = supabaseAdminFindUser(payload.getEmail());
                if (existingAuthUser != null) {
                    persistLocalUser(payload, existingAuthUser.path("id").asText());
                    JsonNode authData = supabasePasswordLogin(payload.getEmail(), payload.getPassword());
                    return completeSignIn("User account restored successfully", payload.getEmail(), authData, response);
                }
            }
            throw exception;
        }
        persistLocalUser(payload, created.path("id").asText());

        JsonNode authData = supabasePasswordLogin(payload.getEmail(), payload.getPassword());
        return completeSignIn("User registered successfully", payload.getEmail(), authData, response);
    }

    private AuthResponse completeSignIn(String message, String email, JsonNode authData, HttpServletResponse response) {
        String accessToken = authData.path("access_token").asText();
        long expiresAt = sessionExpiresAt(accessToken);
        AuthUserResponse profile = getProfile(email);
        long remainingMillis = requireActiveSession(expiresAt);
        long maxAge = Math.min(SESSION_SECONDS, (remainingMillis + 999) / 1000);
        setAuthCookie(response, "sb-access-token", accessToken, maxAge);
        setAuthCookie(response, "sb-refresh-token", "", 0);
        return new AuthResponse(message, profile, expiresAt);
    }

    public AuthResponse getMe(HttpServletRequest request) {
        String accessToken = getCookieValue(request, "sb-access-token");
        if (accessToken == null || accessToken.isBlank()) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        // Reject expired claims early. Supabase verifies the token before any user is authorized.
        long expiresAt = sessionExpiresAt(accessToken);
        requireActiveSession(expiresAt);
        String userEmail = supabaseGetUser(accessToken).path("email").asText("");
        if (userEmail.isBlank()) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        AuthUserResponse profile = getProfile(userEmail);
        requireActiveSession(expiresAt);
        return new AuthResponse(null, profile, expiresAt);
    }

    private long sessionExpiresAt(String accessToken) {
        String[] parts = accessToken.split("\\.", -1);
        if (parts.length != 3) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid session");
        }
        try {
            JsonNode claims = objectMapper.readTree(Base64.getUrlDecoder().decode(parts[1]));
            long issuedAt = claims.path("iat").asLong(0);
            long tokenExpiry = claims.path("exp").asLong(0);
            if (issuedAt > 0 && tokenExpiry > issuedAt) {
                return Math.multiplyExact(Math.min(Math.addExact(issuedAt, SESSION_SECONDS), tokenExpiry), 1000);
            }
        } catch (IOException | IllegalArgumentException | ArithmeticException ignored) {
            // Malformed tokens cannot start or continue a session.
        }
        throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid session");
    }

    private long requireActiveSession(long expiresAt) {
        long remainingMillis = expiresAt - System.currentTimeMillis();
        if (remainingMillis <= 0) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Session expired");
        }
        return remainingMillis;
    }

    public User resolveCurrentUser(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store");
        AuthUserResponse me = getMe(request).getUser();
        return authRepository.findUserById(UUID.fromString(me.getUserId()))
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private JsonNode supabasePasswordLogin(String email, String password) {
        if (supabaseUrl == null || supabaseUrl.isEmpty() || supabaseAnonKey == null || supabaseAnonKey.isEmpty()) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Supabase credentials not configured");
        }
        try {
            String url = supabaseUrl + "/auth/v1/token?grant_type=password";
            Map<String, String> bodyMap = new HashMap<>();
            bodyMap.put("email", email);
            bodyMap.put("password", password);
            String jsonBody = objectMapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseAnonKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (httpResponse.statusCode() != 200) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
            }
            return objectMapper.readTree(httpResponse.body());
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Supabase login failed: " + e.getMessage());
        }
    }

    private JsonNode supabaseGetUser(String accessToken) {
        try {
            String url = supabaseUrl + "/auth/v1/user";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseAnonKey)
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (httpResponse.statusCode() != 200) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid session");
            }
            return objectMapper.readTree(httpResponse.body());
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Failed to get user from Supabase: " + e.getMessage());
        }
    }

    private void persistLocalUser(RegisterPayload payload, String createdUserId) {
        Organization org = new Organization();
        org.setOrgId(UUID.randomUUID());
        org.setOrgName(payload.getOrgName());
        org.setDomainName("@" + payload.getOrgName().toLowerCase().replaceAll("\\s+", "") + ".com");
        org.setStorageLimit("10GB");
        org.setCreatedAt(LocalDateTime.now());
        Organization savedOrg = authRepository.saveOrganization(org);

        User user = new User();
        user.setUserId(UUID.fromString(createdUserId));
        user.setOrgId(savedOrg.getOrgId());
        user.setUserName(payload.getUserName());
        user.setUserEmail(payload.getEmail());
        user.setRole("user");
        user.setJoinedAt(LocalDateTime.now());
        user.setLoginAt(LocalDateTime.now());
        user.setIsActive(true);
        authRepository.saveUser(user);
    }

    private JsonNode supabaseAdminFindUser(String email) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users?per_page=1000&page=1";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseServiceRoleKey)
                    .header("Authorization", "Bearer " + supabaseServiceRoleKey)
                    .GET()
                    .build();

            HttpResponse<String> httpResponse =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (httpResponse.statusCode() != 200) {
                return null;
            }

            JsonNode response = objectMapper.readTree(httpResponse.body());
            JsonNode users = response.path("users");
            if (!users.isArray()) {
                return null;
            }
            for (JsonNode user : users) {
                if (email.equalsIgnoreCase(user.path("email").asText())) {
                    return user;
                }
            }
        } catch (Exception ignored) {
            return null;
        }
        return null;
    }

    private JsonNode supabaseAdminCreateUser(String email, String password) {
        if (supabaseServiceRoleKey == null || supabaseServiceRoleKey.isEmpty()) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "SUPABASE_SERVICE_ROLE_KEY is not configured");
        }
        try {
            String url = supabaseUrl + "/auth/v1/admin/users";
            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("email", email);
            bodyMap.put("password", password);
            bodyMap.put("email_confirm", true);
            String jsonBody = objectMapper.writeValueAsString(bodyMap);

            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseServiceRoleKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody));
            requestBuilder.header("Authorization", "Bearer " + supabaseServiceRoleKey);

            HttpResponse<String> httpResponse = httpClient.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
            int status = httpResponse.statusCode();
            if (status != 200 && status != 201) {
                String supabaseMessage = extractSupabaseError(httpResponse.body());
                HttpStatus responseStatus = status == 422
                        ? HttpStatus.UNPROCESSABLE_ENTITY
                        : (status == 401 || status == 403 ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST);
                throw new AppException(responseStatus, supabaseMessage);
            }
            return objectMapper.readTree(httpResponse.body());
        } catch (ConnectException e) {
            throw new AppException(HttpStatus.BAD_GATEWAY, "Could not connect to Supabase. Check SUPABASE_URL.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AppException(HttpStatus.SERVICE_UNAVAILABLE, "The Supabase request was interrupted. Try again.");
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(HttpStatus.BAD_GATEWAY,
                    "Failed to create user in Supabase (" + e.getClass().getSimpleName() + ")");
        }
    }

    private String extractSupabaseError(String body) {
        if (body == null || body.isBlank()) {
            return "Supabase rejected the registration";
        }
        try {
            JsonNode node = objectMapper.readTree(body);
            for (String field : List.of("msg", "message", "error_description", "error")) {
                JsonNode value = node.path(field);
                if (!value.isMissingNode() && value.isTextual() && !value.asText().isBlank()) {
                    return value.asText();
                }
            }
        } catch (Exception ignored) {
            // Use the plain response body below when it is not JSON.
        }
        return body.length() > 300 ? body.substring(0, 300) : body;
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }
}

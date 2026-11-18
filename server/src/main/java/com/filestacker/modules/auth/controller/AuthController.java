package com.filestacker.modules.auth.controller;

import com.filestacker.modules.auth.dto.*;
import com.filestacker.modules.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginPayload payload,
            HttpServletResponse response
    ) {
        AuthResponse result = authService.login(payload, response);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody @Valid RegisterPayload payload,
            HttpServletResponse response
    ) {
        AuthResponse result = authService.register(payload, response);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        authService.clearAuthCookies(response);
        Map<String, String> body = new HashMap<>();
        body.put("message", "Logout successful");
        return ResponseEntity.ok(body);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        response.setHeader("Cache-Control", "no-store");
        return ResponseEntity.ok(authService.getMe(request));
    }
}

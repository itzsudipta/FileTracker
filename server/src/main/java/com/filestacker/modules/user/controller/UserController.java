package com.filestacker.modules.user.controller;

import com.filestacker.modules.user.entity.User;
import com.filestacker.modules.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Matches GET /api/user/me?user_id={user_id}
    @GetMapping("/api/user/me")
    public ResponseEntity<?> getUserProfile(@RequestParam("user_id") UUID userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.ok(error);
        }
        return ResponseEntity.ok(userOpt.get());
    }

    // Matches GET /getUserData/{user_id}
    @GetMapping("/getUserData/{user_id}")
    public ResponseEntity<?> getUserData(@PathVariable("user_id") UUID userId) {
        List<User> users = userService.findAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.ok("no files found");
        }
        return ResponseEntity.ok(users);
    }

    // Matches POST /createuser/
    @PostMapping("/createuser/")
    public ResponseEntity<User> createUser() {
        User user = userService.createSampleUser();
        return ResponseEntity.ok(user);
    }
}

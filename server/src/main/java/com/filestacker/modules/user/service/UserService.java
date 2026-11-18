package com.filestacker.modules.user.service;

import com.filestacker.modules.user.entity.User;
import com.filestacker.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findById(UUID userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByUserEmail(email);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User save(User user) {
        if (user.getUserId() == null) {
            user.setUserId(UUID.randomUUID());
        }
        if (user.getJoinedAt() == null) {
            user.setJoinedAt(LocalDateTime.now());
        }
        return userRepository.save(user);
    }

    @Transactional
    public User createSampleUser() {
        User user = new User();
        user.setUserId(UUID.randomUUID());
        user.setOrgId(UUID.fromString("3a833e58-514c-4643-bdff-1a3532e2f830"));
        user.setUserName("Sudipta Sarkar");
        user.setUserEmail("abc@zoho.in");
        user.setRole("admin");
        user.setJoinedAt(LocalDateTime.now());
        user.setIsActive(true);
        return userRepository.save(user);
    }
}

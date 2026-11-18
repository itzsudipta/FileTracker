package com.filestacker.modules.auth.repository;

import com.filestacker.modules.organization.entity.Organization;
import com.filestacker.modules.organization.repository.OrganizationRepository;
import com.filestacker.modules.user.entity.User;
import com.filestacker.modules.user.repository.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class AuthRepository {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public AuthRepository(UserRepository userRepository, OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByUserEmail(email);
    }

    public Optional<User> findUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    public Optional<Organization> findOrganizationById(UUID orgId) {
        return organizationRepository.findById(orgId);
    }

    public User saveUser(User user) {
        return userRepository.saveAndFlush(user);
    }

    public Organization saveOrganization(Organization org) {
        return organizationRepository.saveAndFlush(org);
    }
}

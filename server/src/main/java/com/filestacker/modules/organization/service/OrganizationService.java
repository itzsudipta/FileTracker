package com.filestacker.modules.organization.service;

import com.filestacker.modules.organization.entity.Organization;
import com.filestacker.modules.organization.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public Optional<Organization> findById(UUID orgId) {
        return organizationRepository.findById(orgId);
    }

    public Optional<Organization> findByName(String orgName) {
        return organizationRepository.findByOrgName(orgName);
    }

    @Transactional
    public Organization save(Organization org) {
        if (org.getOrgId() == null) {
            org.setOrgId(UUID.randomUUID());
        }
        if (org.getCreatedAt() == null) {
            org.setCreatedAt(LocalDateTime.now());
        }
        return organizationRepository.save(org);
    }

    @Transactional
    public Organization createSampleOrganization() {
        Organization org = new Organization();
        org.setOrgId(UUID.randomUUID());
        org.setOrgName("InnovateX.com");
        org.setDomainName("@innovatex.com");
        org.setPlanId(UUID.randomUUID());
        org.setCreatedAt(LocalDateTime.now());
        org.setStorageLimit("50 GB");
        return organizationRepository.save(org);
    }
}

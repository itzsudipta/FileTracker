package com.filestacker.modules.organization.controller;

import com.filestacker.modules.organization.entity.Organization;
import com.filestacker.modules.organization.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    // Matches POST /createorg/
    @PostMapping("/createorg/")
    public ResponseEntity<Organization> createOrg() {
        Organization newOrg = organizationService.createSampleOrganization();
        System.out.println("Organization created successfully");
        return ResponseEntity.ok(newOrg);
    }

    @GetMapping("/api/org/{id}")
    public ResponseEntity<?> getOrgById(@PathVariable("id") UUID id) {
        Optional<Organization> org = organizationService.findById(id);
        if (org.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(org.get());
    }
}

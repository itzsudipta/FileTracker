package com.filestacker.modules.subscription.controller;

import com.filestacker.modules.subscription.entity.Subscription;
import com.filestacker.modules.subscription.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    // Matches POST /createsubscription/
    @PostMapping("/createsubscription/")
    public ResponseEntity<Subscription> createSubscription() {
        Subscription newSub = subscriptionService.createSampleSubscription();
        System.out.println("Subscription created successfully");
        return ResponseEntity.ok(newSub);
    }

    @GetMapping("/api/subscription/org/{org_id}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByOrg(@PathVariable("org_id") UUID orgId) {
        List<Subscription> subs = subscriptionService.findByOrgId(orgId);
        return ResponseEntity.ok(subs);
    }
}

package com.filestacker.modules.subscription.service;

import com.filestacker.modules.subscription.entity.Subscription;
import com.filestacker.modules.subscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    public List<Subscription> findByOrgId(UUID orgId) {
        return subscriptionRepository.findByOrgId(orgId);
    }

    @Transactional
    public Subscription save(Subscription subscription) {
        if (subscription.getSubscripId() == null) {
            subscription.setSubscripId(UUID.randomUUID());
        }
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public Subscription createSampleSubscription() {
        Subscription newSub = new Subscription();
        newSub.setSubscripId(UUID.randomUUID());
        newSub.setOrgId(UUID.fromString("3a833e58-514c-4643-bdff-1a3532e2f830"));
        newSub.setPlanId(UUID.fromString("8b7ef5d4-4182-4586-a819-596b217acf89"));
        newSub.setStartDate(LocalDateTime.parse("2024-06-01T00:00:00"));
        newSub.setEndDate(LocalDateTime.parse("2025-06-01T00:00:00"));
        newSub.setStatus("active");
        return subscriptionRepository.save(newSub);
    }
}

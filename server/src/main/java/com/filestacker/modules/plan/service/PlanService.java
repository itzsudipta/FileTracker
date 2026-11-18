package com.filestacker.modules.plan.service;

import com.filestacker.modules.plan.entity.Plan;
import com.filestacker.modules.plan.repository.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Optional<Plan> getPlanById(UUID planId) {
        return planRepository.findById(planId);
    }

    @Transactional
    public Plan save(Plan plan) {
        if (plan.getPlanId() == null) {
            plan.setPlanId(UUID.randomUUID());
        }
        return planRepository.save(plan);
    }

    @Transactional
    public Plan createSamplePlan() {
        Plan plan = new Plan();
        plan.setPlanId(UUID.randomUUID());
        plan.setPlanName("Pro Plan");
        plan.setStorageLimit(100);
        plan.setApiLimit(10000);
        plan.setPricePerMnth(new BigDecimal("29.99"));
        plan.setAiFeature(Collections.singletonList("Basic AI Integration"));
        return planRepository.save(plan);
    }
}

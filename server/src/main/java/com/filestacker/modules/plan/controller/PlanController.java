package com.filestacker.modules.plan.controller;

import com.filestacker.modules.plan.entity.Plan;
import com.filestacker.modules.plan.service.PlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    // Matches POST /createplan/
    @PostMapping("/createplan/")
    public ResponseEntity<Plan> createPlan() {
        Plan plan = planService.createSamplePlan();
        System.out.println("Plan created successfully");
        return ResponseEntity.ok(plan);
    }

    // Matches GET /getplandata/
    @GetMapping("/getplandata/")
    public ResponseEntity<?> getPlansData() {
        List<Plan> plans = planService.getAllPlans();
        if (plans.isEmpty()) {
            return ResponseEntity.ok("no files found");
        }
        return ResponseEntity.ok(plans);
    }
}

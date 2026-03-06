package com.fitness.aiservice.handler;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    final private RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Recommendation> getUserRecommendation(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<Recommendation>> getRecommendation(@PathVariable String activityId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForActivity(activityId));
    }

}

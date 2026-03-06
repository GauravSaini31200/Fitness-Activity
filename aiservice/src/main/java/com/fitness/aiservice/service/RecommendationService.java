package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    public Recommendation getRecommendationsForUser(String userId) {
        return recommendationRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No recommendations found for user: " + userId));
    }

    public List<Recommendation> getRecommendationsForActivity(String activityId) {
        return recommendationRepository.findByActivityId(activityId);
    }
}

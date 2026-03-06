package com.fitness.aiservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class AiRecommendationResponse {

    private Analysis analysis;
    private List<Improvement> improvements;
    private List<Suggestion> suggestions;
    private List<String> safety;

    @Data
    public static class Analysis {
        private String overall;
        private String pace;
        private String heartRate;
        private String caloriesBurned;
    }

    @Data
    public static class Improvement {
        private String area;
        private String recommendation;
    }

    @Data
    public static class Suggestion {
        private String workout;
        private String description;
    }
}


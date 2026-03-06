package com.fitness.aiservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.AiRecommendationResponse;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public Recommendation generateRecommendationsForActivity(Activity activity) {
        Prompt prompt = createPrompt(activity);
        log.info("Generated prompt for activity: {}", prompt);
        String aiResponse = geminiService.getGeminiResponse(prompt);
        log.info("Raw AI response: {}", aiResponse);

        AiRecommendationResponse parsed = parseResponse(aiResponse);
        return mapToRecommendation(parsed, activity);
    }

    private String extractJson(String response) {
        if (response == null || response.isBlank()) {
            throw new RuntimeException("Empty AI response");
        }
        // Strip markdown code fences: ```json ... ``` or ``` ... ```
        String trimmed = response.trim();
        if (trimmed.startsWith("```")) {
            // Remove opening fence (with optional language tag)
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline != -1) {
                trimmed = trimmed.substring(firstNewline + 1);
            }
            // Remove closing fence
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.lastIndexOf("```"));
            }
        }
        return trimmed.trim();
    }

    private AiRecommendationResponse parseResponse(String aiResponse) {
        String json = extractJson(aiResponse);
        try {
            return objectMapper.readValue(json, AiRecommendationResponse.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse AI response JSON: {}", json, e);
            throw new RuntimeException("Failed to parse AI recommendation response", e);
        }
    }

    private Recommendation mapToRecommendation(AiRecommendationResponse parsed, Activity activity) {
        Recommendation rec = new Recommendation();
        rec.setActivityId(activity.getId());
        rec.setUserId(activity.getUserId());
        rec.setActivityType(activity.getType());
        rec.setCaloriesBurned(activity.getCaloriesBurned());
        rec.setDuration(activity.getDuration());

        // Overall analysis
        if (parsed.getAnalysis() != null) {
            rec.setRecommendation(parsed.getAnalysis().getOverall());
        }

        // Improvements: combine area + recommendation into readable strings
        if (parsed.getImprovements() != null) {
            List<String> improvements = parsed.getImprovements().stream()
                    .map(i -> i.getArea() + ": " + i.getRecommendation())
                    .toList();
            rec.setImprovements(improvements);
        } else {
            rec.setImprovements(Collections.emptyList());
        }

        // Suggestions: combine workout + description
        if (parsed.getSuggestions() != null) {
            List<String> suggestions = parsed.getSuggestions().stream()
                    .map(s -> s.getWorkout() + ": " + s.getDescription())
                    .toList();
            rec.setSuggestions(suggestions);
        } else {
            rec.setSuggestions(Collections.emptyList());
        }

        // Safety tips
        rec.setSafetyTips(parsed.getSafety() != null ? parsed.getSafety() : Collections.emptyList());

        return rec;
    }

    private Prompt createPrompt(Activity activity) {
        String promptText = """
                Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
                ```json
                {
                  "analysis": {
                    "overall": "Overall analysis here",
                    "pace": "Pace analysis here",
                    "heartRate": "Heart rate analysis here",
                    "caloriesBurned": "Calories analysis here"
                  },
                  "improvements": [
                    {
                      "area": "Area name",
                      "recommendation": "Detailed recommendation"
                    }
                  ],
                  "suggestions": [
                    {
                      "workout": "Workout name",
                      "description": "Detailed workout description"
                    }
                  ],
                  "safety": [
                    "Safety point 1",
                    "Safety point 2"
                  ]
                }
                ```
                
                Analyze this activity:
                Activity Type: %s
                Duration: %s minutes
                Calories Burned: %s
                Additional Metrics: %s
                
                Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
                Ensure the response follows the EXACT JSON format shown above.
                """.formatted(
                        activity.getType(),
                        activity.getDuration(),
                        activity.getCaloriesBurned(),
                        formatAdditionalMetrics(activity.getAdditionalMetrics())
                );
        return new Prompt(promptText);
    }

    private String formatAdditionalMetrics(Map<String, Object> additionalMetrics) {
        if (additionalMetrics == null || additionalMetrics.isEmpty()) {
            return "None";
        }
        StringBuilder formatted = new StringBuilder();
        additionalMetrics.forEach((key, value) ->
            formatted.append(key).append(": ").append(value).append(", ")
        );
        // Remove trailing comma and space
        return formatted.length() > 2 ? formatted.substring(0, formatted.length() - 2) : formatted.toString();
    }

}

package com.fitness.aiservice.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "recommendations")
@Data
public class Recommendation {
    @Id
    private String id;
    private String userId;
    private int caloriesBurned;
    private int duration;
    private String activityType;
    private String activityId;
    private String recommendation;
    private List<String> improvements;
    private List<String> suggestions;
    private List<String> safetyTips;
    @CreatedDate
    private LocalDateTime createdAt;
}

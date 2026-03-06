package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = {"${rabbitmq.queue.name}"})
    public void processActivity(Activity activity){
        try {
            log.info("Received activity message: {}", activity);
            Recommendation recommendation = aiService.generateRecommendationsForActivity(activity);
            Recommendation saved = recommendationRepository.save(recommendation);
            log.info("Saved recommendation with id: {} for activity: {}", saved.getId(), activity.getId());
        } catch (Exception e) {
            log.error("Error processing activity message for activity id: {}. Error: {}",
                    activity != null ? activity.getId() : "null", e.getMessage(), e);
            throw new AmqpRejectAndDontRequeueException("Failed to process activity message", e);
        }
    }
}

package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String getGeminiResponse(Prompt prompt) {
        log.info("Sending prompt to Gemini: {}", prompt);
        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }
}

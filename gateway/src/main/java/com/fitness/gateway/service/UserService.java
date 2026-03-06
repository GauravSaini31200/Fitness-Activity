package com.fitness.gateway.service;

import com.fitness.gateway.dto.RegisterRequest;
import com.fitness.gateway.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserService {

    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId) {
        return userServiceWebClient.get()
                .uri("/api/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode().is4xxClientError()) {
                        return Mono.error(new RuntimeException("User not found with id: " + userId));
                    }
                    return Mono.error(new RuntimeException("Unexpected error while validating user with id: " + userId, e));
                });
    }

    public Mono<UserResponse> registerUser(RegisterRequest registerRequest){
        return userServiceWebClient.post()
                .uri("/api/users/register")
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode().is4xxClientError()) {
                        return Mono.error(new RuntimeException("Failed to register user: " + e.getResponseBodyAsString()));
                    }
                    return Mono.error(new RuntimeException("Unexpected error while registering user: " + e.getMessage(), e));
                });
    }
}
package com.fitness.userService.service;

import com.fitness.userService.dto.RegisterRequest;
import com.fitness.userService.dto.UserResponse;
import com.fitness.userService.model.User;
import com.fitness.userService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    @Override
    public UserResponse registerUser(RegisterRequest userRequest) {
        User existingUser = userRepository.findByEmail(userRequest.getEmail());
        if(existingUser != null) {
            return mapToUserResponse(existingUser);
        }
        User user = User.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .keycloakId(userRequest.getKeycloakId())
                .build();

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    @Override
    public Boolean validateUser(String userId) {
        return userRepository.existsByKeycloakId(userId);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .keycloakId(user.getKeycloakId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .password(user.getPassword())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

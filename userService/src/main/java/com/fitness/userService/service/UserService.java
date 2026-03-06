package com.fitness.userService.service;

import com.fitness.userService.dto.RegisterRequest;
import com.fitness.userService.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserResponse getUserProfile(String userId);

    UserResponse registerUser(RegisterRequest userRequest);

    Boolean validateUser(String userId);
}

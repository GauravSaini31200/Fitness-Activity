package com.fitness.userService.handler;

import com.fitness.userService.dto.RegisterRequest;
import com.fitness.userService.dto.UserResponse;
import com.fitness.userService.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class userController {

    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@NotNull @PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@NotNull @PathVariable String userId) {
        return ResponseEntity.ok(userService.validateUser(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterRequest userRequest) {
        return ResponseEntity.ok(userService.registerUser(userRequest));
    }
}

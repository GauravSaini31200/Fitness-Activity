package com.fitness.gateway.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String keycloakId;

    @NotBlank(message = "Password is required")
    @Size(min=6, message = "Password must be at least 6 characters")
    private String password;
    private String firstName;
    private String lastName;
}

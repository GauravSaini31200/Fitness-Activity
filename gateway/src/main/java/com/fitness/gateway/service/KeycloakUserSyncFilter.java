package com.fitness.gateway.service;

import com.fitness.gateway.dto.RegisterRequest;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain){
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        if(token != null && token.startsWith("Bearer ")){
            String userId;
            try {
                String tokenWithoutBearer = token.replace("Bearer ", "").trim();
                SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
                userId = signedJWT.getJWTClaimsSet().getSubject();
            } catch (Exception e) {
                log.error("Error parsing JWT token: {}", e.getMessage());
                return chain.filter(exchange);
            }

            if(userId == null){
                return chain.filter(exchange);
            }

            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if(Boolean.TRUE.equals(exist)){
                            log.warn("User already exists with id: {}", userId);
                            return Mono.empty();
                        } else {
                            // User does not exist, proceed with registering the user in the system
                            RegisterRequest request = getUserDetailsFromToken(token);
                            return userService.registerUser(request);
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest serverHttpRequest = exchange.getRequest()
                                .mutate()
                                .header("X-User-Id", userId)
                                .build();
                        ServerWebExchange mutatedExchange = exchange.mutate().request(serverHttpRequest).build();
                        return chain.filter(mutatedExchange);
                    }))
                    .onErrorResume(e -> {
                        log.error("Error validating user with id: {}. Error: {}", userId, e.getMessage());
                        return Mono.error(new RuntimeException("User validation failed for user id: " + userId));
                    });
        }
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetailsFromToken(String token) {
        try{
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            return RegisterRequest.builder()
                    .keycloakId(claimsSet.getStringClaim("sub"))
                    .email(claimsSet.getStringClaim("email"))
                    .firstName(claimsSet.getStringClaim("given_name"))
                    .lastName(claimsSet.getStringClaim("family_name"))
                    .password("defaultPassword") // Set a default password or generate one as needed
                    .build();
        }catch (Exception e){
            log.error("Error extracting user details from token: {}", e.getMessage());
            throw new RuntimeException("Failed to extract user details from token");
        }
    }


}

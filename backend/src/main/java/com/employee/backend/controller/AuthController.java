package com.employee.backend.controller;

import com.employee.backend.dto.user.UserRequest;
import com.employee.backend.dto.user.UserResponse;
import com.employee.backend.model.User;
import com.employee.backend.repository.UserRepository;
import com.employee.backend.security.JwtService;
import com.employee.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                password
                        )
                );

        return jwtService.generateToken(
                authentication
        );
    }

    @PostMapping("/register-manager")
    public UserResponse registerManager(
            @RequestBody UserRequest request) {

        return userService.createManager(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication) {

        User user = userRepository
                .findByEmail(
                        authentication.getName()
                )
                .orElseThrow();

        UserResponse response =
                new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setType(user.getType());
        response.setManagerId(
                user.getManagerId()
        );

        return response;
    }
}
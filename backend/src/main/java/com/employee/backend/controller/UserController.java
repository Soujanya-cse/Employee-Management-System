package com.employee.backend.controller;

import com.employee.backend.dto.user.UserRequest;
import com.employee.backend.dto.user.UserResponse;
import com.employee.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(
            @RequestBody UserRequest request,
            Authentication authentication) {

        return userService.createUser(
                request,
                authentication
        );
    }

    @GetMapping
    public List<UserResponse> getAllUsers(
            Authentication authentication) {

        return userService.getAllUsers(
                authentication
        );
    }

    @GetMapping("/type/{type}")
    public List<UserResponse> getUsersByType(
            @PathVariable String type,
            Authentication authentication) {

        return userService.getUsersByType(
                type,
                authentication
        );
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(
            @PathVariable String id,
            Authentication authentication) {

        return userService.getUserById(
                id,
                authentication
        );
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable String id,
            @RequestBody UserRequest request,
            Authentication authentication) {

        return userService.updateUser(
                id,
                request,
                authentication
        );
    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable String id,
            Authentication authentication) {

        userService.deleteUser(
                id,
                authentication
        );
    }
}
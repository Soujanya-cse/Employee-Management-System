package com.employee.backend.service;

import com.employee.backend.dto.user.UserRequest;
import com.employee.backend.dto.user.UserResponse;
import com.employee.backend.model.User;
import com.employee.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse createManager(UserRequest request) {

        List<User> users = userRepository.findAll();

        int highestNumber = 0;

        for (User existingUser : users) {

            String existingId = existingUser.getId();

            if (existingId != null
                    && existingId.startsWith("MGR")) {

                String numberPart = existingId.substring(3);

                try {

                    int number = Integer.parseInt(numberPart);

                    if (number > highestNumber) {
                        highestNumber = number;
                    }

                } catch (NumberFormatException e) {
                }
            }
        }

        int nextNumber = highestNumber + 1;

        String newManagerId = String.format("MGR%03d", nextNumber);

        User manager = new User();

        manager.setId(newManagerId);
        manager.setName(request.getName());
        manager.setEmail(request.getEmail());

        manager.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        manager.setType("MANAGER");
        manager.setManagerId(null);

        User savedManager = userRepository.save(manager);

        return convertToResponse(savedManager);
    }

    public UserResponse createUser(
            UserRequest request,
            Authentication authentication) {

        List<User> users = userRepository.findAll();

        int highestNumber = 0;

        for (User existingUser : users) {

            String existingId = existingUser.getId();

            if (existingId != null
                    && existingId.startsWith("EMP")) {

                String numberPart = existingId.substring(3);

                try {

                    int number = Integer.parseInt(numberPart);

                    if (number > highestNumber) {
                        highestNumber = number;
                    }

                } catch (NumberFormatException e) {
                }
            }
        }

        int nextNumber = highestNumber + 1;

        String newEmployeeId = String.format("EMP%03d", nextNumber);

        User manager = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        User user = new User();

        user.setId(newEmployeeId);
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        user.setType("EMPLOYEE");
        user.setManagerId(manager.getId());

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    public List<UserResponse> getAllUsers(
            Authentication authentication) {

        User manager = getLoggedInManager(authentication);

        return userRepository
                .findByTypeAndManagerId(
                        "EMPLOYEE",
                        manager.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public UserResponse getUserById(
            String id,
            Authentication authentication) {

        User manager = getLoggedInManager(authentication);

        return userRepository.findById(id)
                .filter(user -> user.getType().equals("EMPLOYEE")
                        && manager.getId().equals(
                        user.getManagerId()))
                .map(this::convertToResponse)
                .orElse(null);
    }

    public List<UserResponse> getUsersByType(
            String type,
            Authentication authentication) {

        User manager = getLoggedInManager(authentication);

        return userRepository
                .findByTypeAndManagerId(
                        type,
                        manager.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public UserResponse updateUser(
            String id,
            UserRequest request,
            Authentication authentication) {

        User manager = getLoggedInManager(authentication);

        return userRepository.findById(id)
                .filter(existingUser -> existingUser.getType().equals("EMPLOYEE")
                        && manager.getId().equals(
                        existingUser.getManagerId()))
                .map(existingUser -> {

                    existingUser.setName(
                            request.getName());

                    existingUser.setEmail(
                            request.getEmail());

                    if (request.getPassword() != null
                            && !request.getPassword()
                            .trim()
                            .isEmpty()) {

                        existingUser.setPassword(
                                passwordEncoder.encode(
                                        request.getPassword()));
                    }

                    User savedUser = userRepository.save(
                            existingUser);

                    return convertToResponse(
                            savedUser);
                })
                .orElse(null);
    }

    public void deleteUser(
            String id,
            Authentication authentication) {

        User manager = getLoggedInManager(authentication);

        userRepository.findById(id)
                .filter(user -> user.getType().equals("EMPLOYEE")
                        && manager.getId().equals(
                        user.getManagerId()))
                .ifPresent(userRepository::delete);
    }

    private User getLoggedInManager(
            Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .filter(user -> user.getType().equals("MANAGER"))
                .orElseThrow(() -> new RuntimeException(
                        "Manager not found."));
    }

    private UserResponse convertToResponse(
            User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setType(user.getType());
        response.setManagerId(
                user.getManagerId());

        return response;
    }
}
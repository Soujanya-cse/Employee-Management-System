package com.employee.backend.controller;

import com.employee.backend.model.Task;
import com.employee.backend.model.User;
import com.employee.backend.repository.UserRepository;
import com.employee.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public Task createTask(
            @RequestBody Task task,
            Authentication authentication) {

        return taskService.createTask(
                task,
                authentication
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public List<Task> getAllTasks(
            Authentication authentication) {

        return taskService.getAllTasks(
                authentication
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{id}")
    public Task getTaskById(
            @PathVariable Integer id,
            Authentication authentication) {

        return taskService.getTaskById(
                id,
                authentication
        );
    }

    @GetMapping("/employee/{employeeId}")
    public List<Task> getTasksByEmployee(
            @PathVariable String employeeId,
            Authentication authentication) {

        User loggedInUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        if (loggedInUser.getType().equals("EMPLOYEE")
                && !loggedInUser.getId().equals(employeeId)) {

            throw new RuntimeException(
                    "You are not authorized to view these tasks."
            );
        }

        return taskService.getTasksByEmployee(
                employeeId,
                authentication
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Integer id,
            @RequestBody Task task,
            Authentication authentication) {

        return taskService.updateTask(
                id,
                task,
                authentication
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public void deleteTask(
            @PathVariable Integer id,
            Authentication authentication) {

        taskService.deleteTask(
                id,
                authentication
        );
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(
            @PathVariable Integer id,
            @RequestParam String status,
            Authentication authentication) {

        User loggedInUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        Task task = taskService.getTaskById(
                id,
                authentication
        );

        if (task == null) {
            throw new RuntimeException(
                    "Task not found."
            );
        }

        if (loggedInUser.getType().equals("EMPLOYEE")
                && !loggedInUser.getId().equals(
                task.getAssignedTo())) {

            throw new RuntimeException(
                    "You are not authorized to update this task."
            );
        }

        return taskService.updateTaskStatus(
                id,
                status
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/{id}/manager-status")
    public Task updateManagerStatus(
            @PathVariable Integer id,
            @RequestParam String status,
            Authentication authentication) {

        Task task = taskService.getTaskById(
                id,
                authentication
        );

        if (task == null) {
            throw new RuntimeException(
                    "You are not authorized to update this task."
            );
        }

        return taskService.updateTaskStatusByManager(
                id,
                status
        );
    }
}
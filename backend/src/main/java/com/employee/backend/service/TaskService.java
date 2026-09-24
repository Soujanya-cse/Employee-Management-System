package com.employee.backend.service;

import com.employee.backend.model.Task;
import com.employee.backend.model.User;
import com.employee.backend.repository.TaskRepository;
import com.employee.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Task createTask(
            Task task,
            Authentication authentication) {

        User manager = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        User employee = userRepository
                .findById(task.getAssignedTo())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found."
                        )
                );

        if (!employee.getType().equals("EMPLOYEE")
                || !manager.getId().equals(
                employee.getManagerId()
        )) {

            throw new RuntimeException(
                    "You are not authorized to assign this task to this employee."
            );
        }

        List<Task> tasks = taskRepository.findAll();

        int nextId = 1;

        for (Task existingTask : tasks) {

            if (existingTask.getId() != null
                    && existingTask.getId() >= nextId) {

                nextId = existingTask.getId() + 1;
            }
        }

        task.setId(nextId);
        task.setStatus("TO-DO");
        task.setManagerId(manager.getId());

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(
            Authentication authentication) {

        User manager = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        return taskRepository.findByManagerId(
                manager.getId()
        );
    }

    public Task getTaskById(
            Integer id,
            Authentication authentication) {

        User loggedInUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        return taskRepository
                .findById(id)
                .filter(task -> {

                    if (loggedInUser.getType().equals("MANAGER")) {

                        return loggedInUser.getId().equals(
                                task.getManagerId()
                        );
                    }

                    if (loggedInUser.getType().equals("EMPLOYEE")) {

                        return loggedInUser.getId().equals(
                                task.getAssignedTo()
                        );
                    }

                    return false;
                })
                .orElse(null);
    }

    public List<Task> getTasksByEmployee(
            String employeeId,
            Authentication authentication) {

        User loggedInUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        User employee = userRepository
                .findById(employeeId)
                .orElseThrow();

        if (loggedInUser.getType().equals("MANAGER")
                && !loggedInUser.getId().equals(
                employee.getManagerId()
        )) {

            throw new RuntimeException(
                    "You are not authorized to view these tasks."
            );
        }

        if (loggedInUser.getType().equals("EMPLOYEE")
                && !loggedInUser.getId().equals(
                employeeId
        )) {

            throw new RuntimeException(
                    "You are not authorized to view these tasks."
            );
        }

        return taskRepository.findByAssignedTo(
                employeeId
        );
    }

    public Task updateTask(
            Integer id,
            Task updatedTask,
            Authentication authentication) {

        User manager = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        User employee = userRepository
                .findById(updatedTask.getAssignedTo())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found."
                        )
                );

        if (!employee.getType().equals("EMPLOYEE")
                || !manager.getId().equals(
                employee.getManagerId()
        )) {

            throw new RuntimeException(
                    "You are not authorized to assign this task to this employee."
            );
        }

        return taskRepository.findById(id)
                .filter(task ->
                        manager.getId().equals(
                                task.getManagerId()
                        )
                )
                .map(existingTask -> {

                    existingTask.setTitle(
                            updatedTask.getTitle()
                    );

                    existingTask.setDescription(
                            updatedTask.getDescription()
                    );

                    existingTask.setPriority(
                            updatedTask.getPriority()
                    );

                    existingTask.setAssignedTo(
                            updatedTask.getAssignedTo()
                    );

                    return taskRepository.save(
                            existingTask
                    );
                })
                .orElse(null);
    }

    public void deleteTask(
            Integer id,
            Authentication authentication) {

        User manager = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        taskRepository.findById(id)
                .filter(task ->
                        manager.getId().equals(
                                task.getManagerId()
                        )
                )
                .ifPresent(taskRepository::delete);
    }

    public Task updateTaskStatus(
            Integer id,
            String newStatus) {

        Task task = taskRepository.findById(id)
                .orElse(null);

        if (task == null) {
            return null;
        }

        String currentStatus = task.getStatus();

        if (currentStatus == null
                || currentStatus.isBlank()) {

            currentStatus = "TO-DO";
        }

        boolean validTransition = false;

        if (currentStatus.equals("TO-DO")
                && newStatus.equals("ONGOING")) {

            validTransition = true;

        } else if (currentStatus.equals("ONGOING")
                && newStatus.equals("COMPLETED")) {

            validTransition = true;

        } else if (currentStatus.equals("ONGOING")
                && newStatus.equals("BLOCKED")) {

            validTransition = true;

        } else if (currentStatus.equals("BLOCKED")
                && newStatus.equals("ONGOING")) {

            validTransition = true;
        }

        if (!validTransition) {
            throw new RuntimeException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }

        task.setStatus(newStatus);

        return taskRepository.save(task);
    }

    public Task updateTaskStatusByManager(
            Integer id,
            String newStatus) {

        Task task = taskRepository.findById(id)
                .orElse(null);

        if (task == null) {
            return null;
        }

        task.setStatus(newStatus);

        return taskRepository.save(task);
    }
}
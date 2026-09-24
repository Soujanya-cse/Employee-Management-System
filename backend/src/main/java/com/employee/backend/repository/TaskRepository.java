package com.employee.backend.repository;

import com.employee.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, Integer> {

    List<Task> findByAssignedTo(String assignedTo);

    List<Task> findByManagerId(String managerId);
}
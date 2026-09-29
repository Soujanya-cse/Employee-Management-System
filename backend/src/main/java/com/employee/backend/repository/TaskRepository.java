package com.employee.backend.repository;

import com.employee.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, Integer> {

    List<Task> findByAssignedTo(String assignedTo);

    List<Task> findByManagerId(String managerId);

    @Query("""
            {
                'managerId': ?0,
                'status': ?1,
                'priority': ?2
            }
            """)
    List<Task> findByManagerIdAndStatusAndPriority(
            String managerId,
            String status,
            String priority
    );

    @Query("""
            {
                'managerId': ?0,
                'status': ?1
            }
            """)
    List<Task> findByManagerIdAndStatus(
            String managerId,
            String status
    );

    @Query("""
            {
                'managerId': ?0,
                'priority': ?1
            }
            """)
    List<Task> findByManagerIdAndPriority(
            String managerId,
            String priority
    );
}
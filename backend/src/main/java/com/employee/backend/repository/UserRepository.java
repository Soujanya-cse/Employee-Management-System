package com.employee.backend.repository;

import com.employee.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends MongoRepository<User, String> {

    List<User> findByType(String type);

    Optional<User> findByEmail(String email);

    List<User> findByTypeAndManagerId(
            String type,
            String managerId
    );
}
package com.employee.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tasks")
public class Task {

    @Id
    private Integer id;

    private String title;

    private String description;

    private String priority;

    private String assignedTo;

    private String status;

    private String managerId;
}
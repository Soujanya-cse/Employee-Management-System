package com.employee.backend.dto.user;

import lombok.Data;

@Data
public class UserResponse {

    private String id;

    private String name;

    private String email;

    private String type;

    private String managerId;
}
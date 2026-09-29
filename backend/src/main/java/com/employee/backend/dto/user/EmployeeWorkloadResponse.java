package com.employee.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeWorkloadResponse {

    private String employeeId;
    private String employeeName;

    private int totalTasks;
    private int todoTasks;
    private int ongoingTasks;
    private int blockedTasks;
    private int completedTasks;
}
package com.employee.backend.repository;

import com.employee.backend.dto.user.EmployeeWorkloadResponse;
import com.employee.backend.model.User;
import org.springframework.data.mongodb.repository.Aggregation;
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

    @Aggregation(pipeline = {
            "{ $match: { type: 'EMPLOYEE', managerId: ?0 } }",
            "{ $lookup: { from: 'tasks', localField: '_id', foreignField: 'assignedTo', as: 'tasks' } }",
            "{ $match: { $expr: { $eq: [ { $size: '$tasks' }, 0 ] } } }"
    })
    List<User> findEmployeesWithoutTasks(String managerId);

    @Aggregation(pipeline = {
            "{ $match: { type: 'EMPLOYEE', managerId: ?0 } }",
            "{ $lookup: { from: 'tasks', let: { emp: '$_id' }, " +
                    "pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$assignedTo', '$$emp'] }, { $eq: ['$managerId', ?0] }] } } }], as: 'tasks' } }",
            "{ $unwind: { path: '$tasks', preserveNullAndEmptyArrays: true } }",
            "{ $group: { _id: '$_id', employeeName: { $first: '$name' }, totalTasks: { $sum: { $cond: [{ $in: ['$tasks.status', ['TO-DO', 'ONGOING', 'BLOCKED', 'COMPLETED']] }, 1, 0] } }, " +
                    "todoTasks: { $sum: { $cond: [{ $eq: ['$tasks.status', 'TO-DO'] }, 1, 0] } }, ongoingTasks: { $sum: { $cond: [{ $eq: ['$tasks.status', 'ONGOING'] }, 1, 0] } }, " +
                    "blockedTasks: { $sum: { $cond: [{ $eq: ['$tasks.status', 'BLOCKED'] }, 1, 0] } }, completedTasks: { $sum: { $cond: [{ $eq: ['$tasks.status', 'COMPLETED'] }, 1, 0] } } } }",
            "{ $project: { _id: 0, employeeId: '$_id', employeeName: 1, totalTasks: 1, todoTasks: 1, ongoingTasks: 1, blockedTasks: 1, completedTasks: 1 } }"
    })
    List<EmployeeWorkloadResponse> findEmployeeWorkload(String managerId);
}
package com.example.demo.Repository;


import com.example.demo.Model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByStatus(LeaveRequest.LeaveStatus status);
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    long countByStatus(LeaveRequest.LeaveStatus status);
}
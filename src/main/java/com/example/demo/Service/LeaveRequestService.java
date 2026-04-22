package com.example.demo.Service;

import com.example.demo.Model.Employee;
import com.example.demo.Model.LeaveRequest;
import com.example.demo.Repository.EmployeeRepository;
import com.example.demo.Repository.LeaveRequestRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.LeaveRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private EmployeeRepository empRepo;

    @Autowired
    private UserRepository userRepo;

    // =========================
    // GET ALL LEAVES (ADMIN)
    // =========================
    public List<LeaveRequestDTO> getAllLeaves() {
        return leaveRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET MY LEAVES (EMPLOYEE)
    // =========================
    public List<LeaveRequestDTO> getMyLeaves(String username) {

        var user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var emp = empRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return leaveRepo.findByEmployeeIdOrderByCreatedAtDesc(emp.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET EMPLOYEE LEAVES (ADMIN)
    // =========================
    public List<LeaveRequestDTO> getEmployeeLeaves(Long empId) {
        return leaveRepo.findByEmployeeIdOrderByCreatedAtDesc(empId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // APPLY LEAVE (EMPLOYEE)
    // =========================
    public LeaveRequestDTO applyLeave(LeaveRequestDTO dto, String username) {

        var user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var emp = empRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee not linked"));

        LeaveRequest lr = new LeaveRequest();
        lr.setEmployee(emp);
        lr.setStartDate(dto.getStartDate());
        lr.setEndDate(dto.getEndDate());

        lr.setLeaveType(
                LeaveRequest.LeaveType.valueOf(dto.getLeaveType().toUpperCase())
        );

        lr.setReason(dto.getReason());
        lr.setStatus(LeaveRequest.LeaveStatus.PENDING);

        return toDTO(leaveRepo.save(lr));
    }

    // =========================
    // UPDATE STATUS (APPROVE / REJECT)
    // =========================
    public LeaveRequestDTO updateLeaveStatus(Long id, String status, String comment) {

        LeaveRequest lr = leaveRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        // ✅ FIX: Safe enum conversion
        LeaveRequest.LeaveStatus newStatus =
                LeaveRequest.LeaveStatus.valueOf(status.toUpperCase());

        lr.setStatus(newStatus);
        lr.setAdminComment(comment);

        // ✅ If approved → update employee status
        if (newStatus == LeaveRequest.LeaveStatus.APPROVED) {
            Employee emp = lr.getEmployee();
            emp.setStatus(Employee.EmployeeStatus.ON_LEAVE);
            empRepo.save(emp);
        }

        return toDTO(leaveRepo.save(lr));
    }

    // =========================
    // CANCEL LEAVE (EMPLOYEE)
    // =========================
    public void cancelLeave(Long id, String username) {

        var user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeaveRequest lr = leaveRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        if (!lr.getEmployee().getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        leaveRepo.delete(lr);
    }

    // =========================
    // DTO MAPPER
    // =========================
    private LeaveRequestDTO toDTO(LeaveRequest lr) {

        LeaveRequestDTO dto = new LeaveRequestDTO();

        String fullName = lr.getEmployee().getFirstName()
                + " " + lr.getEmployee().getLastName();

        dto.setId(lr.getId());
        dto.setEmployeeId(lr.getEmployee().getId());
        dto.setEmployeeName(fullName);
        dto.setEmployeeDepartment(lr.getEmployee().getDepartment());

        dto.setStartDate(lr.getStartDate());
        dto.setEndDate(lr.getEndDate());

        dto.setLeaveType(
                lr.getLeaveType() != null ? lr.getLeaveType().name() : null
        );

        dto.setReason(lr.getReason());

        dto.setStatus(
                lr.getStatus() != null ? lr.getStatus().name() : null
        );

        dto.setAdminComment(lr.getAdminComment());
        dto.setCreatedAt(lr.getCreatedAt());

        return dto;
    }
}
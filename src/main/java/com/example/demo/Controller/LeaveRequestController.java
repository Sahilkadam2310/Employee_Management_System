package com.example.demo.Controller;


import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Service.LeaveRequestService;
import com.example.demo.dto.LeaveRequestDTO;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

	@Autowired
    private  LeaveRequestService leaveService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveRequestDTO>> getMyLeaves(Authentication auth) {
        return ResponseEntity.ok(leaveService.getMyLeaves(auth.getName()));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequestDTO>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDTO> applyLeave(@RequestBody LeaveRequestDTO dto, Authentication auth) {
        return ResponseEntity.ok(leaveService.applyLeave(dto, auth.getName()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestDTO> approveLeave(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(id, "APPROVED", body.get("comment")));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestDTO> rejectLeave(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(id, "REJECTED", body.get("comment")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelLeave(@PathVariable Long id, Authentication auth) {
        leaveService.cancelLeave(id, auth.getName());
        return ResponseEntity.ok(Map.of("message", "Leave request cancelled"));
    }
}
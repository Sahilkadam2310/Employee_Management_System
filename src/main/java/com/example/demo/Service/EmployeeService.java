package com.example.demo.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Model.Employee;
import com.example.demo.Model.User;
import com.example.demo.Repository.EmployeeRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.EmployeeDTO;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

	@Autowired
    private  EmployeeRepository employeeRepository;
	@Autowired
    private UserRepository userRepository;
	@Autowired
    private PasswordEncoder passwordEncoder;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
            .map(this::toDTO).collect(Collectors.toList());
    }

    public EmployeeDTO getEmployee(Long id) {
        return toDTO(employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found")));
    }

    public List<EmployeeDTO> searchEmployees(String query) {
        return employeeRepository.searchEmployees(query).stream()
            .map(this::toDTO).collect(Collectors.toList());
    }

    public List<String> getDepartments() {
        return employeeRepository.findAllDepartments();
    }
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO dto) {

        // Create User
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(
            dto.getPassword() != null ? dto.getPassword() : "employee@123"));
        user.setRole(User.Role.ROLE_EMPLOYEE);
        user.setEnabled(true);

        user = userRepository.save(user);

        // Create Employee
        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setAddress(dto.getAddress());

        if (dto.getStatus() != null) {
            employee.setStatus(Employee.EmployeeStatus.valueOf(dto.getStatus()));
        } else {
            employee.setStatus(Employee.EmployeeStatus.ACTIVE);
        }

        employee.setUser(user);

        return toDTO(employeeRepository.save(employee));
    }
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setAddress(dto.getAddress());
        if (dto.getStatus() != null) {
            employee.setStatus(Employee.EmployeeStatus.valueOf(dto.getStatus()));
        }

        return toDTO(employeeRepository.save(employee));
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        Long userId = employee.getUser() != null ? employee.getUser().getId() : null;
        employeeRepository.delete(employee);
        if (userId != null) userRepository.deleteById(userId);
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", employeeRepository.count());
        stats.put("activeEmployees", employeeRepository.countByStatus(Employee.EmployeeStatus.ACTIVE));
        stats.put("inactiveEmployees", employeeRepository.countByStatus(Employee.EmployeeStatus.INACTIVE));
        stats.put("onLeave", employeeRepository.countByStatus(Employee.EmployeeStatus.ON_LEAVE));
        stats.put("departments", employeeRepository.findAllDepartments().size());
        return stats;
    }

    public EmployeeDTO toDTO(Employee e) {
    	return new EmployeeDTO(
    		    e.getId(),
    		    e.getFirstName(),
    		    e.getLastName(),
    		    e.getEmail(),
    		    e.getPhone(),
    		    e.getDepartment(),
    		    e.getPosition(),
    		    e.getSalary(),
    		    e.getJoiningDate(),
    		    e.getStatus() != null ? e.getStatus().name() : null,
    		    e.getAddress(),
    		    e.getProfileImage(),
    		    e.getUser() != null ? e.getUser().getId() : null,
    		    e.getUser() != null ? e.getUser().getUsername() : null,
    		    null,
    		    e.getCreatedAt(),
    		    e.getUpdatedAt()
    		);
    }}
package com.example.demo.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Model.Employee;
import com.example.demo.Model.User;
import com.example.demo.Repository.EmployeeRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // ✅ LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
            );

            User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            Employee employee = null;
            if (user.getRole() == User.Role.ROLE_EMPLOYEE) {
                employee = employeeRepository.findByUserId(user.getId()).orElse(null);
            }

            // ✅ Using constructor instead of builder
            LoginResponse response = new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                employee != null ? employee.getId() : null,
                session.getId()
            );

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(error);
        }
    }

    // ✅ LOGOUT API
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();

        SecurityContextHolder.clearContext();

        Map<String, String> res = new HashMap<>();
        res.put("message", "Logged out successfully");

        return ResponseEntity.ok(res);
    }

    // ✅ GET CURRENT USER
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Not authenticated");
            return ResponseEntity.status(401).body(error);
        }

        String username = auth.getName();

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Employee employee = null;
        if (user.getRole() == User.Role.ROLE_EMPLOYEE) {
            employee = employeeRepository.findByUserId(user.getId()).orElse(null);
        }

        // ✅ Using constructor
        LoginResponse response = new LoginResponse(
            user.getId(),
            user.getUsername(),
            user.getRole().name(),
            employee != null ? employee.getId() : null,
            null
        );

        return ResponseEntity.ok(response);
    }
}
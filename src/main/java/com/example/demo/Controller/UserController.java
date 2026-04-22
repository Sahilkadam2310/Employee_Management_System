//package com.example.demo.Controller;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.demo.Model.Role;
//import com.example.demo.Model.User;
//import com.example.demo.Repository.RoleRepo;
//import com.example.demo.Repository.UserssRepo;
//import com.example.demo.Service.UserService;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/auth")
//public class UserController {
//
//    @Autowired
//    private UserService userssService;
//    @Autowired
//    private UserssRepo userRepository;
//    @Autowired
//    private RoleRepo roleRepository;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody User user) {
//
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        user.setCreatedAt(LocalDateTime.now());
//        user.setUpdatedAt(LocalDateTime.now());
//
//        Role role = roleRepository.findByName("EMPLOYEE");
//
//        if (role == null) {
//            return ResponseEntity.badRequest().body("Role not found ❌");
//        }
//
//        user.setRole(role);
//
//        userRepository.save(user);
//
//        return ResponseEntity.ok("User registered successfully ✅");
//    }
//    
//    @GetMapping("/user/{username}")
//    public ResponseEntity<User> getUser(@PathVariable String username) {
//        return ResponseEntity.ok(userssService.getUserByUsername(username));
//    }
//
//    @GetMapping("/users")
//    public ResponseEntity<List<User>> getAllUsers() {
//        return ResponseEntity.ok(userssService.getAllUsers());
//    }
//  
//}
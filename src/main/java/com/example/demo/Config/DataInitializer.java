package com.example.demo.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.Model.Employee;
import com.example.demo.Model.User;
import com.example.demo.Repository.EmployeeRepository;
import com.example.demo.Repository.UserRepository;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmployeeRepository empRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) {

        // ✅ Admin
        if (!userRepo.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(User.Role.ROLE_ADMIN);
            admin.setEnabled(true);

            userRepo.save(admin);
            System.out.println("✅ Admin created: admin / admin123");
        }

        // ✅ Employee 1
        if (!userRepo.existsByUsername("john")) {
            User u = new User();
            u.setUsername("john");
            u.setPassword(encoder.encode("emp123"));
            u.setRole(User.Role.ROLE_EMPLOYEE);
            u.setEnabled(true);

            u = userRepo.save(u);

            Employee e = new Employee();
            e.setFirstName("John");
            e.setLastName("Doe");
            e.setEmail("john.doe@company.com");
            e.setPhone("+91 9876543210");
            e.setDepartment("Engineering");
            e.setPosition("Senior Developer");
            e.setSalary(85000.0);
            e.setJoiningDate(LocalDate.of(2022, 3, 15));
            e.setStatus(Employee.EmployeeStatus.ACTIVE);
            e.setAddress("Ichalkaranji, Maharashtra");
            e.setUser(u);

            empRepo.save(e);
            System.out.println("✅ Employee created: john / emp123");
        }

        // ✅ Employee 2
        if (!userRepo.existsByUsername("priya")) {
            User u = new User();
            u.setUsername("priya");
            u.setPassword(encoder.encode("emp123"));
            u.setRole(User.Role.ROLE_EMPLOYEE);
            u.setEnabled(true);

            u = userRepo.save(u);

            Employee e = new Employee();
            e.setFirstName("Priya");
            e.setLastName("Sharma");
            e.setEmail("priya.sharma@company.com");
            e.setPhone("+91 9123456789");
            e.setDepartment("HR");
            e.setPosition("HR Manager");
            e.setSalary(70000.0);
            e.setJoiningDate(LocalDate.of(2021, 7, 1));
            e.setStatus(Employee.EmployeeStatus.ACTIVE);
            e.setAddress("Kolhapur, Maharashtra");
            e.setUser(u);

            empRepo.save(e);
            System.out.println("✅ Employee created: priya / emp123");
        }

        // ✅ Employee 3
        if (!userRepo.existsByUsername("rahul")) {
            User u = new User();
            u.setUsername("rahul");
            u.setPassword(encoder.encode("emp123"));
            u.setRole(User.Role.ROLE_EMPLOYEE);
            u.setEnabled(true);

            u = userRepo.save(u);

            Employee e = new Employee();
            e.setFirstName("Rahul");
            e.setLastName("Patil");
            e.setEmail("rahul.patil@company.com");
            e.setPhone("+91 9988776655");
            e.setDepartment("Finance");
            e.setPosition("Analyst");
            e.setSalary(60000.0);
            e.setJoiningDate(LocalDate.of(2023, 1, 10));
            e.setStatus(Employee.EmployeeStatus.ACTIVE);
            e.setAddress("Pune, Maharashtra");
            e.setUser(u);

            empRepo.save(e);
            System.out.println("✅ Employee created: rahul / emp123");
        }
    }
}
package com.example.demo.Repository;


import com.example.demo.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findByDepartment(String department);
    List<Employee> findByStatus(Employee.EmployeeStatus status);

    @Query("SELECT DISTINCT e.department FROM Employee e WHERE e.department IS NOT NULL")
    List<String> findAllDepartments();

    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.department) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Employee> searchEmployees(@Param("search") String search);

    long countByStatus(Employee.EmployeeStatus status);
    long countByDepartment(String department);
}
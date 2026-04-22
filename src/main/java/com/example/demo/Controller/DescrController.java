//package com.example.demo.Controller;
//
//
//import com.example.demo.Model.Department;
//import com.example.demo.Service.DescriService;
//
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/departments")
//@RequiredArgsConstructor
//public class DescrController {
//
//	@Autowired
//    private  DescriService departmentService;
//
//    @PostMapping
//    public ResponseEntity<Department> addDepartment(@RequestBody Department department) {
//        return ResponseEntity.ok(departmentService.addDepartment(department));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
//        return ResponseEntity.ok(departmentService.updateDepartment(id, department));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
//        departmentService.deleteDepartment(id);
//        return ResponseEntity.ok("Department deleted successfully");
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
//        return ResponseEntity.ok(departmentService.getDepartmentById(id));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Department>> getAllDepartments() {
//        return ResponseEntity.ok(departmentService.getAllDepartments());
//    }
//}
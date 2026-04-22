//package com.example.demo.Service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.example.demo.Model.Department;
//import com.example.demo.Repository.DepartmentRepo;
//
//import lombok.RequiredArgsConstructor;
//
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class DescriService {
//
//	@Autowired
//    private DepartmentRepo departmentRepository;
//
//    public Department addDepartment(Department department) {
//        return departmentRepository.save(department);
//    }
//
//    public Department updateDepartment(Long id, Department departmentDetails) {
//        Department department = departmentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Department not found"));
//
//        department.setName(departmentDetails.getName());
//        department.setDescription(departmentDetails.getDescription());
//
//        return departmentRepository.save(department);
//    }
//
//    public void deleteDepartment(Long id) {
//        departmentRepository.deleteById(id);
//    }
//
//    public Department getDepartmentById(Long id) {
//        return departmentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Department not found"));
//    }
//
//    public List<Department> getAllDepartments() {
//        return departmentRepository.findAll();
//    }
//}
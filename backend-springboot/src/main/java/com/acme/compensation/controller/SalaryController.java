package com.acme.compensation.controller;

import com.acme.compensation.dto.*;
import com.acme.compensation.model.AuditLog;
import com.acme.compensation.model.Employee;
import com.acme.compensation.service.SalaryEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ACME Global Salary Management REST Controller
 * Author: Truptiranjan Biswal (https://github.com/Truptiranjan98)
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SalaryController {

    @Autowired
    private SalaryEngineService salaryService;

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(salaryService.getAllEmployees());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.ok(salaryService.getEmployeeById(id));
    }

    @PostMapping("/employees/{id}/adjust-salary")
    public ResponseEntity<Employee> adjustSalary(@PathVariable String id, @RequestBody SalaryAdjustmentRequest req) {
        return ResponseEntity.ok(salaryService.adjustSalary(id, req));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(salaryService.getAuditLogs());
    }

    @GetMapping("/analytics/departments")
    public ResponseEntity<List<DepartmentMetric>> getDepartmentMetrics() {
        return ResponseEntity.ok(salaryService.getDepartmentMetrics());
    }

    @GetMapping("/analytics/level-distribution")
    public ResponseEntity<List<LevelBoxplotMetric>> getLevelDistribution() {
        return ResponseEntity.ok(salaryService.getLevelBoxplots());
    }
}

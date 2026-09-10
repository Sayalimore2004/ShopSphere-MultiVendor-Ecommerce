package com.shopsphere.controller;

import com.shopsphere.dto.AdminLoginRequest;
import com.shopsphere.dto.AdminResponse;
import com.shopsphere.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Admin Login
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
            @RequestBody AdminLoginRequest request) {

        var admin = adminService.loginAdmin(
                request.getEmail(),
                request.getPassword()
        );

        if (admin.isPresent()) {

            String token =
                    adminService.generateLoginToken(
                            admin.get()
                    );

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put("token", token);
            response.put(
                    "admin",
                    new AdminResponse(admin.get())
            );

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401)
                .body("Invalid email or password");
    }

    // Admin Dashboard Statistics
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("totalSellers", adminService.getTotalSellers());
        stats.put("totalCustomers", adminService.getTotalCustomers());
        stats.put("totalProducts", adminService.getTotalProducts());
        stats.put("pendingProducts", adminService.getPendingProducts());
        stats.put("totalOrders", adminService.getTotalOrders());
        stats.put("totalSales", adminService.getTotalSales());

        return ResponseEntity.ok(stats);
    }
}
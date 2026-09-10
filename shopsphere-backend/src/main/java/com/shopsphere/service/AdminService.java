package com.shopsphere.service;

import com.shopsphere.entity.Admin;
import com.shopsphere.entity.Order;
import com.shopsphere.repository.AdminRepository;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.SellerRepository;
import com.shopsphere.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final SellerRepository sellerRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminService(
            AdminRepository adminRepository,
            SellerRepository sellerRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.sellerRepository = sellerRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // Admin Login
    // =========================

    public Optional<Admin> loginAdmin(
            String email,
            String password) {

        Optional<Admin> admin =
                adminRepository.findByEmail(email);

        if (admin.isPresent()
                && passwordEncoder.matches(
                        password,
                        admin.get().getPassword())) {

            return admin;
        }

        return Optional.empty();
    }

    // Generate JWT token for Admin
    public String generateLoginToken(Admin admin) {

        return jwtService.generateToken(
                admin.getId(),
                admin.getEmail(),
                "ADMIN"
        );
    }

    // =========================
    // Admin Dashboard
    // =========================

    // Total sellers
    public long getTotalSellers() {

        return sellerRepository.count();
    }

    // Total customers
    public long getTotalCustomers() {

        return customerRepository.count();
    }

    // Total products
    public long getTotalProducts() {

        return productRepository.count();
    }

    // Pending products
    public long getPendingProducts() {

        return productRepository
                .findByStatus("PENDING")
                .size();
    }

    // Total orders
    public long getTotalOrders() {

        return orderRepository.count();
    }

    // Total sales
    public double getTotalSales() {

        List<Order> orders =
                orderRepository.findAll();

        double totalSales = 0;

        for (Order order : orders) {

            totalSales +=
                    order.getTotalAmount();
        }

        return totalSales;
    }
}
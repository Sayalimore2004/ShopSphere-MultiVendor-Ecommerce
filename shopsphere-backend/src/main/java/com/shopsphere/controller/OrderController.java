package com.shopsphere.controller;

import com.shopsphere.dto.PlaceOrderRequest;
import com.shopsphere.entity.Order;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.repository.SellerRepository;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;

    public OrderController(
            OrderService orderService,
            CustomerRepository customerRepository,
            SellerRepository sellerRepository) {

        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.sellerRepository = sellerRepository;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request) {

        Order savedOrder =
                orderService.placeOrder(request);

        return ResponseEntity.ok(savedOrder);
    }

    // Customer Order History
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerOrders(
            @PathVariable Long customerId,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var customer =
                customerRepository.findByEmail(loggedInEmail);

        if (customer.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Customer not found");
        }

        if (!customer.get().getId().equals(customerId)) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to access these orders");
        }

        return ResponseEntity.ok(
                orderService.getCustomerOrders(customerId)
        );
    }

    // Detailed Customer Order History
    @GetMapping("/customer/{customerId}/history")
    public ResponseEntity<?> getCustomerOrderHistory(
            @PathVariable Long customerId,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var customer =
                customerRepository.findByEmail(loggedInEmail);

        if (customer.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Customer not found");
        }

        if (!customer.get().getId().equals(customerId)) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to access this order history");
        }

        return ResponseEntity.ok(
                orderService.getCustomerOrderHistory(customerId)
        );
    }

    // Seller Order Management
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getSellerOrders(
            @PathVariable Long sellerId,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var seller =
                sellerRepository.findByEmail(loggedInEmail);

        if (seller.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Seller not found");
        }

        if (!seller.get().getId().equals(sellerId)) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to access these orders");
        }

        return ResponseEntity.ok(
                orderService.getSellerOrders(sellerId)
        );
    }

    // Admin Order Management - View All Orders
    @GetMapping("/admin")
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // Admin Order Management - Update Order Status
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateOrderStatusByAdmin(
            @PathVariable Long id,
            @RequestParam String status) {

        try {

            Order updatedOrder =
                    orderService.updateOrderStatusByAdmin(
                            id,
                            status
                    );

            return ResponseEntity.ok(updatedOrder);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // Get Order By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(
            @PathVariable Long id) {

        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // Seller-specific Order Status Update
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Long sellerId,
            @RequestParam String status,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var seller =
                sellerRepository.findByEmail(loggedInEmail);

        if (seller.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Seller not found");
        }

        if (!seller.get().getId().equals(sellerId)) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to update this order");
        }

        try {

            Order updatedOrder =
                    orderService.updateOrderStatus(
                            id,
                            sellerId,
                            status
                    );

            return ResponseEntity.ok(updatedOrder);

        } catch (RuntimeException e) {

            return ResponseEntity.status(403)
                    .body(e.getMessage());
        }
    }
}
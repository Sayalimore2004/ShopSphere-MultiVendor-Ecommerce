package com.shopsphere.controller;

import com.shopsphere.dto.CustomerLoginRequest;
import com.shopsphere.dto.CustomerResponse;
import com.shopsphere.entity.Customer;
import com.shopsphere.service.CustomerService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(
            CustomerService customerService) {

        this.customerService = customerService;
    }


    // =====================================================
    // REGISTER CUSTOMER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<CustomerResponse> registerCustomer(
            @Valid @RequestBody Customer customer) {

        Customer savedCustomer =
                customerService.registerCustomer(customer);

        return ResponseEntity.ok(
                new CustomerResponse(savedCustomer)
        );
    }


    // =====================================================
    // CUSTOMER LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(
            @RequestBody CustomerLoginRequest request) {

        var customer =
                customerService.loginCustomer(
                        request.getEmail(),
                        request.getPassword()
                );

        if (customer.isPresent()) {

            String token =
                    customerService.generateLoginToken(
                            customer.get()
                    );

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "token",
                    token
            );

            response.put(
                    "customer",
                    new CustomerResponse(
                            customer.get()
                    )
            );

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401)
                .body("Invalid email or password");
    }


    // =====================================================
    // GET ALL CUSTOMERS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllCustomers() {

        return ResponseEntity.ok(
                customerService.getAllCustomers()
                        .stream()
                        .map(CustomerResponse::new)
                        .toList()
        );
    }


    // =====================================================
    // GET CUSTOMER PROFILE
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerProfile(
            @PathVariable Long id,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();


        var loggedInCustomer =
                customerService.findByEmail(
                        loggedInEmail
                );


        if (loggedInCustomer.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Customer not found");
        }


        if (!loggedInCustomer.get()
                .getId()
                .equals(id)) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You are not allowed to access this profile"
                    );
        }


        return customerService
                .getCustomerById(id)
                .map(customer ->
                        ResponseEntity.ok(
                                new CustomerResponse(customer)
                        )
                )
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // UPDATE CUSTOMER PROFILE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomerProfile(
            @PathVariable Long id,
            @Valid @RequestBody Customer updatedCustomer,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();


        var loggedInCustomer =
                customerService.findByEmail(
                        loggedInEmail
                );


        if (loggedInCustomer.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Customer not found");
        }


        if (!loggedInCustomer.get()
                .getId()
                .equals(id)) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You are not allowed to update this profile"
                    );
        }


        try {

            Customer updated =
                    customerService.updateCustomer(
                            id,
                            updatedCustomer
                    );

            return ResponseEntity.ok(
                    new CustomerResponse(updated)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}


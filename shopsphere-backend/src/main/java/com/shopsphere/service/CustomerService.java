package com.shopsphere.service;

import com.shopsphere.entity.Customer;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public CustomerService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Customer registerCustomer(Customer customer) {

        customer.setPassword(
                passwordEncoder.encode(customer.getPassword())
        );

        return customerRepository.save(customer);
    }

    public Optional<Customer> loginCustomer(
            String email,
            String password) {

        Optional<Customer> customer =
                customerRepository.findByEmail(email);

        if (customer.isPresent()
                && passwordEncoder.matches(
                        password,
                        customer.get().getPassword())) {

            return customer;
        }

        return Optional.empty();
    }

    public String generateLoginToken(Customer customer) {

        return jwtService.generateToken(
                customer.getId(),
                customer.getEmail(),
                "CUSTOMER"
        );
    }

    public Optional<Customer> getCustomerById(Long id) {

        return customerRepository.findById(id);
    }

    public Optional<Customer> findByEmail(String email) {

        return customerRepository.findByEmail(email);
    }

    public Customer updateCustomer(
            Long id,
            Customer updatedCustomer) {

        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found"
                                )
                        );

        customer.setName(
                updatedCustomer.getName()
        );

        customer.setEmail(
                updatedCustomer.getEmail()
        );

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }
}


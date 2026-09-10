package com.shopsphere.dto;

import com.shopsphere.entity.Customer;

public class CustomerResponse {

    private Long id;
    private String name;
    private String email;

    public CustomerResponse(Customer customer) {
        this.id = customer.getId();
        this.name = customer.getName();
        this.email = customer.getEmail();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
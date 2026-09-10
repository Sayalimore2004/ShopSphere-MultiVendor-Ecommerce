package com.shopsphere.dto;

import com.shopsphere.entity.Admin;

public class AdminResponse {

    private Long id;
    private String name;
    private String email;

    public AdminResponse(Admin admin) {
        this.id = admin.getId();
        this.name = admin.getName();
        this.email = admin.getEmail();
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

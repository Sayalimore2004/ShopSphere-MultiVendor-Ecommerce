package com.shopsphere.dto;

import com.shopsphere.entity.Seller;

public class SellerResponse {

    private Long id;
    private String name;
    private String email;
    private String storeName;

    public SellerResponse(Seller seller) {
        this.id = seller.getId();
        this.name = seller.getName();
        this.email = seller.getEmail();
        this.storeName = seller.getStoreName();
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

    public String getStoreName() {
        return storeName;
    }
}

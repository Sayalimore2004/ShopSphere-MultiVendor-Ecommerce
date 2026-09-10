package com.shopsphere.repository;

import com.shopsphere.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByCustomerId(Long customerId);

    List<Cart> findByProductId(Long productId);

    Optional<Cart> findByCustomerIdAndProductId(
            Long customerId,
            Long productId
    );
}
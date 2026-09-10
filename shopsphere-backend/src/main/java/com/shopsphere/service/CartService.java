package com.shopsphere.service;

import com.shopsphere.entity.Cart;
import com.shopsphere.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart addToCart(Cart cart) {

        Optional<Cart> existingCart =
                cartRepository.findByCustomerIdAndProductId(
                        cart.getCustomerId(),
                        cart.getProductId()
                );

        if (existingCart.isPresent()) {

            Cart existing = existingCart.get();

            existing.setQuantity(
                    existing.getQuantity() + cart.getQuantity()
            );

            return cartRepository.save(existing);
        }

        return cartRepository.save(cart);
    }

    public List<Cart> getCustomerCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId);
    }

    // Find cart item by ID
    public Optional<Cart> getCartById(Long id) {
        return cartRepository.findById(id);
    }

    // Update cart quantity
    public Cart updateQuantity(Long id, int quantity) {

        Cart cart = cartRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));

        if (quantity < 1) {
            throw new RuntimeException(
                    "Quantity must be at least 1"
            );
        }

        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    public void removeFromCart(Long id) {
        cartRepository.deleteById(id);
    }
}
package com.shopsphere.controller;

import com.shopsphere.entity.Cart;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;
    private final CustomerRepository customerRepository;

    public CartController(
            CartService cartService,
            CustomerRepository customerRepository) {

        this.cartService = cartService;
        this.customerRepository = customerRepository;
    }

    @PostMapping
    public ResponseEntity<?> addToCart(
            @Valid @RequestBody Cart cart,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var customer =
                customerRepository.findByEmail(loggedInEmail);

        if (customer.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Customer not found");
        }

        cart.setCustomerId(customer.get().getId());

        Cart savedCart =
                cartService.addToCart(cart);

        return ResponseEntity.ok(savedCart);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerCart(
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
                    .body("You are not allowed to access this cart");
        }

        List<Cart> cart =
                cartService.getCustomerCart(customerId);

        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long id,
            @RequestParam int quantity,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var customer =
                customerRepository.findByEmail(loggedInEmail);

        if (customer.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Customer not found");
        }

        var cart =
                cartService.getCartById(id);

        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!cart.get().getCustomerId()
                .equals(customer.get().getId())) {

            return ResponseEntity.status(403)
                    .body("You are not allowed to modify this cart item");
        }

        try {

            Cart updatedCart =
                    cartService.updateQuantity(
                            id,
                            quantity
                    );

            return ResponseEntity.ok(updatedCart);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long id,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var customer =
                customerRepository.findByEmail(loggedInEmail);

        if (customer.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("Customer not found");
        }

        var cart =
                cartService.getCartById(id);

        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!cart.get().getCustomerId()
                .equals(customer.get().getId())) {

            return ResponseEntity.status(403)
                    .body("You are not allowed to delete this cart item");
        }

        cartService.removeFromCart(id);

        return ResponseEntity.ok(
                "Item removed from cart"
        );
    }
}
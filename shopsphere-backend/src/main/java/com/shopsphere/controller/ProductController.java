package com.shopsphere.controller;

import com.shopsphere.entity.Product;
import com.shopsphere.repository.SellerRepository;
import com.shopsphere.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductService productService;
    private final SellerRepository sellerRepository;

    public ProductController(
            ProductService productService,
            SellerRepository sellerRepository) {

        this.productService = productService;
        this.sellerRepository = sellerRepository;
    }


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> addProduct(
            @Valid @RequestBody Product product,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var seller =
                sellerRepository.findByEmail(
                        loggedInEmail
                );

        if (seller.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Seller not found");
        }

        // Always use logged-in seller's ID
        product.setSellerId(
                seller.get().getId()
        );

        Product savedProduct =
                productService.addProduct(product);

        return ResponseEntity.ok(savedProduct);
    }


    // =====================================================
    // GET SELLER PRODUCTS
    // =====================================================

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getSellerProducts(
            @PathVariable Long sellerId,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var seller =
                sellerRepository.findByEmail(
                        loggedInEmail
                );

        if (seller.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Seller not found");
        }

        if (!seller.get().getId().equals(sellerId)) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You are not allowed to access these products"
                    );
        }

        return ResponseEntity.ok(
                productService.getProductsBySeller(
                        sellerId
                )
        );
    }


    // =====================================================
    // GET APPROVED PRODUCTS BY SELLER - PUBLIC STORE
    // =====================================================

    @GetMapping("/store/{sellerId}")
    public ResponseEntity<List<Product>> getStoreProducts(
            @PathVariable Long sellerId) {

        List<Product> products =
                productService.getProductsBySeller(sellerId);

        List<Product> approvedProducts =
                products.stream()
                        .filter(product ->
                                product.getStatus() != null &&
                                product.getStatus()
                                        .toUpperCase()
                                        .equals("APPROVED")
                        )
                        .toList();

        return ResponseEntity.ok(approvedProducts);
    }


    // =====================================================
    // GET PENDING PRODUCTS - ADMIN
    // =====================================================

    @GetMapping("/admin/pending")
    public ResponseEntity<List<Product>> getPendingProducts() {

        return ResponseEntity.ok(
                productService.getPendingProducts()
        );
    }


    // =====================================================
    // GET REJECTED PRODUCTS - ADMIN
    // =====================================================

    @GetMapping("/admin/rejected")
    public ResponseEntity<List<Product>> getRejectedProducts() {

        return ResponseEntity.ok(
                productService.getRejectedProducts()
        );
    }


    // =====================================================
    // APPROVE PRODUCT - ADMIN
    // =====================================================

    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approveProduct(
            @PathVariable Long id) {

        try {

            Product approvedProduct =
                    productService.approveProduct(id);

            return ResponseEntity.ok(
                    approvedProduct
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =====================================================
    // REJECT PRODUCT - ADMIN
    // =====================================================

    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<?> rejectProduct(
            @PathVariable Long id) {

        try {

            Product rejectedProduct =
                    productService.rejectProduct(id);

            return ResponseEntity.ok(
                    rejectedProduct
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =====================================================
    // GET APPROVED PRODUCTS
    // =====================================================

    @GetMapping("/approved")
    public ResponseEntity<List<Product>> getApprovedProducts() {

        return ResponseEntity.ok(
                productService.getApprovedProducts()
        );
    }


    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(
            @PathVariable Long id) {

        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product product,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var seller =
                sellerRepository.findByEmail(
                        loggedInEmail
                );

        if (seller.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Seller not found");
        }

        var existingProduct =
                productService.getProductById(id);

        if (existingProduct.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!existingProduct.get()
                .getSellerId()
                .equals(seller.get().getId())) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You are not allowed to update this product"
                    );
        }

        product.setId(id);

        // Prevent seller from changing ownership
        product.setSellerId(
                seller.get().getId()
        );

        Product updatedProduct =
                productService.updateProduct(
                        product
                );

        return ResponseEntity.ok(
                updatedProduct
        );
    }


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        var seller =
                sellerRepository.findByEmail(
                        loggedInEmail
                );

        if (seller.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Seller not found");
        }

        var existingProduct =
                productService.getProductById(id);

        if (existingProduct.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!existingProduct.get()
                .getSellerId()
                .equals(seller.get().getId())) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You are not allowed to delete this product"
                    );
        }

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }
}


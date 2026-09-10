package com.shopsphere.service;

import com.shopsphere.entity.Product;
import com.shopsphere.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {

        this.productRepository = productRepository;
    }


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    public Product addProduct(Product product) {

        // Every new seller product starts as PENDING
        product.setStatus("PENDING");

        return productRepository.save(product);
    }


    // =====================================================
    // GET SELLER PRODUCTS
    // =====================================================

    public List<Product> getProductsBySeller(Long sellerId) {

        return productRepository.findBySellerId(sellerId);
    }


    // =====================================================
    // GET PENDING PRODUCTS
    // =====================================================

    public List<Product> getPendingProducts() {

        return productRepository.findByStatus("PENDING");
    }


    // =====================================================
    // GET APPROVED PRODUCTS
    // =====================================================

    public List<Product> getApprovedProducts() {

        return productRepository.findByStatus("APPROVED");
    }


    // =====================================================
    // GET REJECTED PRODUCTS
    // =====================================================

    public List<Product> getRejectedProducts() {

        return productRepository.findByStatus("REJECTED");
    }


    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    public Optional<Product> getProductById(Long id) {

        return productRepository.findById(id);
    }


    // =====================================================
    // APPROVE PRODUCT
    // =====================================================

    public Product approveProduct(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Product not found"
                                )
                        );

        product.setStatus("APPROVED");

        return productRepository.save(product);
    }


    // =====================================================
    // REJECT PRODUCT
    // =====================================================

    public Product rejectProduct(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Product not found"
                                )
                        );

        product.setStatus("REJECTED");

        return productRepository.save(product);
    }


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    public Product updateProduct(Product product) {

        Product existingProduct =
                productRepository.findById(product.getId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Product not found"
                                )
                        );


        // Preserve the existing approval status
        product.setStatus(
                existingProduct.getStatus()
        );


        return productRepository.save(product);
    }


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    public void deleteProduct(Long id) {

        productRepository.deleteById(id);
    }
}


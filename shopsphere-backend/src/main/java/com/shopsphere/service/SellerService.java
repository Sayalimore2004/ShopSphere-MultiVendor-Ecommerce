package com.shopsphere.service;

import com.shopsphere.entity.Seller;
import com.shopsphere.entity.OrderItem;
import com.shopsphere.entity.Product;
import com.shopsphere.repository.SellerRepository;
import com.shopsphere.repository.OrderItemRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public SellerService(
            SellerRepository sellerRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.sellerRepository = sellerRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Seller registerSeller(Seller seller) {

        // Prevent duplicate seller accounts
        Optional<Seller> existingSeller =
                sellerRepository.findByEmail(seller.getEmail());

        if (existingSeller.isPresent()) {
            throw new RuntimeException(
                    "Seller with this email already exists"
            );
        }

        // Encrypt password before saving
        seller.setPassword(
                passwordEncoder.encode(seller.getPassword())
        );

        return sellerRepository.save(seller);
    }

    public Optional<Seller> loginSeller(
            String email,
            String password) {

        Optional<Seller> seller =
                sellerRepository.findByEmail(email);

        if (seller.isPresent()) {

            System.out.println(
                    "Seller found: " + seller.get().getEmail()
            );

            boolean matches =
                    passwordEncoder.matches(
                            password,
                            seller.get().getPassword()
                    );

            System.out.println(
                    "Password matches: " + matches
            );

            if (matches) {
                return seller;
            }
        }

        return Optional.empty();
    }

    public String generateLoginToken(Seller seller) {

        return jwtService.generateToken(
                seller.getId(),
                seller.getEmail(),
                "SELLER"
        );
    }

    public Optional<Seller> getSellerById(Long id) {
        return sellerRepository.findById(id);
    }

    public Seller updateSeller(Long id, Seller updatedSeller) {

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Seller not found"));

        // Prevent changing email to an email already used
        // by another seller
        Optional<Seller> existingSeller =
                sellerRepository.findByEmail(
                        updatedSeller.getEmail()
                );

        if (existingSeller.isPresent()
                && !existingSeller.get().getId().equals(id)) {

            throw new RuntimeException(
                    "Another seller already uses this email"
            );
        }

        seller.setName(updatedSeller.getName());
        seller.setEmail(updatedSeller.getEmail());
        seller.setStoreName(updatedSeller.getStoreName());

        return sellerRepository.save(seller);
    }

    public long getTotalSellers() {
        return sellerRepository.count();
    }

    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    public double getSellerTotalSales(Long sellerId) {

        List<Product> sellerProducts =
                productRepository.findBySellerId(sellerId);

        double totalSales = 0;

        for (Product product : sellerProducts) {

            List<OrderItem> orderItems =
                    orderItemRepository.findByProductId(
                            product.getId()
                    );

            for (OrderItem orderItem : orderItems) {

                totalSales +=
                        orderItem.getPrice()
                                * orderItem.getQuantity();
            }
        }

        return totalSales;
    }

    public double getSellerCommission(Long sellerId) {

        double totalSales =
                getSellerTotalSales(sellerId);

        return totalSales * 0.10;
    }

    public double getSellerEarnings(Long sellerId) {

        double totalSales =
                getSellerTotalSales(sellerId);

        double commission =
                totalSales * 0.10;

        return totalSales - commission;
    }
}
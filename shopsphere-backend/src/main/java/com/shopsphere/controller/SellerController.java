package com.shopsphere.controller;

import com.shopsphere.dto.SellerLoginRequest;
import com.shopsphere.dto.SellerResponse;
import com.shopsphere.entity.Seller;
import com.shopsphere.service.SellerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sellers")
@CrossOrigin
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping("/register")
    public ResponseEntity<SellerResponse> registerSeller(
            @Valid @RequestBody Seller seller) {

        Seller savedSeller =
                sellerService.registerSeller(seller);

        return ResponseEntity.ok(
                new SellerResponse(savedSeller)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginSeller(
            @RequestBody SellerLoginRequest request) {

        var seller = sellerService.loginSeller(
                request.getEmail(),
                request.getPassword()
        );

        if (seller.isPresent()) {

            String token =
                    sellerService.generateLoginToken(
                            seller.get()
                    );

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put("token", token);
            response.put("seller",
                    new SellerResponse(seller.get()));

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401)
                .body("Invalid email or password");
    }

    @GetMapping
    public ResponseEntity<?> getAllSellers() {

        return ResponseEntity.ok(
                sellerService.getAllSellers()
                        .stream()
                        .map(SellerResponse::new)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSellerProfile(
            @PathVariable Long id) {

        return sellerService.getSellerById(id)
                .map(seller ->
                        ResponseEntity.ok(
                                new SellerResponse(seller)
                        )
                )
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSellerProfile(
            @PathVariable Long id,
            @Valid @RequestBody Seller updatedSeller) {

        try {

            Seller updated =
                    sellerService.updateSeller(
                            id,
                            updatedSeller
                    );

            return ResponseEntity.ok(
                    new SellerResponse(updated)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/earnings")
    public ResponseEntity<?> getSellerEarnings(
            @PathVariable Long id) {

        double totalSales =
                sellerService.getSellerTotalSales(id);

        double commission =
                sellerService.getSellerCommission(id);

        double sellerEarnings =
                sellerService.getSellerEarnings(id);

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("sellerId", id);
        response.put("totalSales", totalSales);
        response.put("commission", commission);
        response.put("sellerEarnings", sellerEarnings);

        return ResponseEntity.ok(response);
    }
}
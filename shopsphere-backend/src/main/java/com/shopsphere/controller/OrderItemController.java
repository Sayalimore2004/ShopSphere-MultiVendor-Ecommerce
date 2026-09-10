package com.shopsphere.controller;

import com.shopsphere.entity.OrderItem;
import com.shopsphere.service.OrderItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping
    public ResponseEntity<OrderItem> addOrderItem(
            @RequestBody OrderItem orderItem) {

        OrderItem savedOrderItem =
                orderItemService.addOrderItem(orderItem);

        return ResponseEntity.ok(savedOrderItem);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItem>> getOrderItems(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderItemService.getOrderItemsByOrderId(orderId)
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<OrderItem>> getProductOrderItems(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                orderItemService.getOrderItemsByProductId(productId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderItem(
            @PathVariable Long id) {

        orderItemService.deleteOrderItem(id);

        return ResponseEntity.ok("Order item deleted successfully");
    }
}

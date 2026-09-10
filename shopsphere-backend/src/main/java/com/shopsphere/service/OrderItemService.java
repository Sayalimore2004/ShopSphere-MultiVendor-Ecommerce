package com.shopsphere.service;

import com.shopsphere.entity.OrderItem;
import com.shopsphere.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public OrderItem addOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public List<OrderItem> getOrderItemsByProductId(Long productId) {
        return orderItemRepository.findByProductId(productId);
    }

    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }
}

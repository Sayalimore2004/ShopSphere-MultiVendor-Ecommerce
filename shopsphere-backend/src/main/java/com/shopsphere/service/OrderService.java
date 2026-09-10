package com.shopsphere.service;

import com.shopsphere.dto.OrderHistoryResponse;
import com.shopsphere.dto.OrderItemRequest;
import com.shopsphere.dto.OrderItemResponse;
import com.shopsphere.dto.PlaceOrderRequest;
import com.shopsphere.dto.SellerOrderResponse;
import com.shopsphere.entity.Cart;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderItem;
import com.shopsphere.entity.Product;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.OrderItemRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            CartRepository cartRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        Order order = new Order();

        order.setCustomerId(request.getCustomerId());
        order.setStatus("PLACED");

        double totalAmount = 0;

        /*
         * Get every product from the database.
         * Price is taken from Product, not from the frontend.
         */
        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId()
            ).orElseThrow(() ->
                    new RuntimeException("Product not found")
            );

            if (itemRequest.getQuantity() <= 0) {
                throw new RuntimeException(
                        "Quantity must be greater than zero"
                );
            }

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }

            double itemTotal =
                    product.getPrice() * itemRequest.getQuantity();

            totalAmount += itemTotal;
        }

        // Set total calculated by backend
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        /*
         * Save order items and reduce stock.
         */
        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId()
            ).orElseThrow(() ->
                    new RuntimeException("Product not found")
            );

            int newStock =
                    product.getStock() - itemRequest.getQuantity();

            product.setStock(newStock);

            productRepository.save(product);

            OrderItem orderItem = new OrderItem();

            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(itemRequest.getQuantity());

            // Price comes directly from database
            orderItem.setPrice(product.getPrice());

            orderItemRepository.save(orderItem);
        }

        // Clear customer's cart after successful order
        List<Cart> cartItems =
                cartRepository.findByCustomerId(request.getCustomerId());

        if (!cartItems.isEmpty()) {
            cartRepository.deleteAll(cartItems);
        }

        return savedOrder;
    }

    public List<Order> getCustomerOrders(Long customerId) {

        return orderRepository.findByCustomerId(customerId);
    }

    // Admin Order Management
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    // Detailed customer order history
    public List<OrderHistoryResponse> getCustomerOrderHistory(Long customerId) {

        List<Order> orders =
                orderRepository.findByCustomerId(customerId);

        List<OrderHistoryResponse> responseList =
                new ArrayList<>();

        for (Order order : orders) {

            OrderHistoryResponse response =
                    new OrderHistoryResponse();

            response.setOrderId(order.getId());
            response.setCustomerId(order.getCustomerId());
            response.setTotalAmount(order.getTotalAmount());
            response.setStatus(order.getStatus());

            List<OrderItem> orderItems =
                    orderItemRepository.findByOrderId(order.getId());

            List<OrderItemResponse> itemResponses =
                    new ArrayList<>();

            for (OrderItem item : orderItems) {

                OrderItemResponse itemResponse =
                        new OrderItemResponse();

                itemResponse.setProductId(item.getProductId());

                Product product = productRepository.findById(
                        item.getProductId()
                ).orElse(null);

                if (product != null) {
                    itemResponse.setProductName(product.getName());
                }

                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setPrice(item.getPrice());

                itemResponses.add(itemResponse);
            }

            response.setItems(itemResponses);

            responseList.add(response);
        }

        return responseList;
    }

    // Seller Order Management
    public List<SellerOrderResponse> getSellerOrders(Long sellerId) {

        List<Product> sellerProducts =
                productRepository.findBySellerId(sellerId);

        List<SellerOrderResponse> responseList =
                new ArrayList<>();

        for (Product product : sellerProducts) {

            List<OrderItem> orderItems =
                    orderItemRepository.findByProductId(product.getId());

            for (OrderItem orderItem : orderItems) {

                Optional<Order> orderOptional =
                        orderRepository.findById(orderItem.getOrderId());

                if (orderOptional.isPresent()) {

                    Order order = orderOptional.get();

                    SellerOrderResponse response =
                            new SellerOrderResponse();

                    response.setOrderId(order.getId());
                    response.setCustomerId(order.getCustomerId());
                    response.setProductId(product.getId());
                    response.setProductName(product.getName());
                    response.setQuantity(orderItem.getQuantity());
                    response.setPrice(orderItem.getPrice());

                    // Seller's item total
                    response.setTotalAmount(
                            orderItem.getPrice()
                                    * orderItem.getQuantity()
                    );

                    response.setStatus(order.getStatus());

                    responseList.add(response);
                }
            }
        }

        return responseList;
    }

    public Optional<Order> getOrderById(Long id) {

        return orderRepository.findById(id);
    }

    // Seller-specific order status update
    public Order updateOrderStatus(Long id, Long sellerId, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        List<OrderItem> orderItems =
                orderItemRepository.findByOrderId(order.getId());

        boolean sellerOwnsOrder = false;

        for (OrderItem orderItem : orderItems) {

            Optional<Product> product =
                    productRepository.findById(orderItem.getProductId());

            if (product.isPresent()
                    && sellerId.equals(product.get().getSellerId())) {

                sellerOwnsOrder = true;
                break;
            }
        }

        if (!sellerOwnsOrder) {
            throw new RuntimeException(
                    "Seller is not authorized to update this order"
            );
        }

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // Admin-specific order status update
    public Order updateOrderStatusByAdmin(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }
}
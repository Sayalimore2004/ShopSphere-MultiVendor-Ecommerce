package com.shopsphere.controller;

import com.shopsphere.entity.ContactMessage;
import com.shopsphere.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(
            ContactMessageService contactMessageService) {

        this.contactMessageService =
                contactMessageService;
    }

    @PostMapping
    public ResponseEntity<ContactMessage> submitContactMessage(
            @Valid @RequestBody ContactMessage contactMessage) {

        ContactMessage savedMessage =
                contactMessageService.saveMessage(
                        contactMessage
                );

        return ResponseEntity.ok(savedMessage);
    }
}

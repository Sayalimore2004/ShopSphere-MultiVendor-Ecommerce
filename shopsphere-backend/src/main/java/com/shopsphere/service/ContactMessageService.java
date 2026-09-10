package com.shopsphere.service;

import com.shopsphere.entity.ContactMessage;
import com.shopsphere.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageService(
            ContactMessageRepository contactMessageRepository) {

        this.contactMessageRepository =
                contactMessageRepository;
    }

    public ContactMessage saveMessage(
            ContactMessage contactMessage) {

        return contactMessageRepository.save(
                contactMessage
        );
    }
}

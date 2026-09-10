package com.shopsphere.config;

import com.shopsphere.entity.Admin;
import com.shopsphere.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (adminRepository.findByEmail(
                    "admin@shopsphere.com").isEmpty()) {

                Admin admin = new Admin();

                admin.setName("ShopSphere Admin");
                admin.setEmail("admin@shopsphere.com");

                admin.setPassword(
                        passwordEncoder.encode(
                                "Admin@ShopSphere123"
                        )
                );

                adminRepository.save(admin);

                System.out.println(
                        "Default admin created successfully."
                );
            }
        };
    }
}

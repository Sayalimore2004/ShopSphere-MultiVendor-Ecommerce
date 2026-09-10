package com.shopsphere.config;

import com.shopsphere.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // Disable Spring Security's default generated in-memory user
    @Bean
    public UserDetailsService userDetailsService() {

        return username -> {
            throw new UsernameNotFoundException(
                    "Default in-memory user is not used"
            );
        };
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://127.0.0.1:5500",
                        "http://localhost:5500"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =====================================================
    // SECURITY CONFIGURATION
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth


                        // =================================================
                        // PUBLIC APIs
                        // =================================================

                        .requestMatchers(
                                "/api/sellers/register",
                                "/api/sellers/login",
                                "/api/sellers/{id}",
                                "/api/customers/register",
                                "/api/customers/login",
                                "/api/admin/login",
                                "/api/products/approved",
                                "/api/products/store/**",
                                "/api/contact"
                        ).permitAll()


                        // =================================================
                        // SELLER APIs
                        // =================================================

                        .requestMatchers(
                                "/api/sellers/**"
                        ).hasRole("SELLER")

                        .requestMatchers(
                                "/api/products/seller/**"
                        ).hasRole("SELLER")


                        // =================================================
                        // CUSTOMER APIs
                        // =================================================

                        .requestMatchers(
                                "/api/cart",
                                "/api/cart/customer/**"
                        ).hasRole("CUSTOMER")

                        .requestMatchers(
                                "/api/orders/customer/**"
                        ).hasRole("CUSTOMER")


                        // =================================================
                        // ADMIN APIs
                        // =================================================

                        .requestMatchers(
                                "/api/admin/**",
                                "/api/products/admin/**",
                                "/api/orders/admin/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}


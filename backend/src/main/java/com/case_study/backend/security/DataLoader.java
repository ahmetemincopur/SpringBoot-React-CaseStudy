package com.case_study.backend.security;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.case_study.backend.model.User;
import com.case_study.backend.service.UserService;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if an admin exists
        if (userService.findByUsername("admin") == null) {
            // If no admin exists, create a default admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setFirstName("Admin");
            admin.setLastName("admin");
            admin.setCity("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Set a default password
            admin.setRole(User.Role.ADMIN); // Set role to ADMIN
            userService.saveUser(admin);

            System.out.println("Default admin user created with username 'admin' and password 'admin123'");
        }
    }
}

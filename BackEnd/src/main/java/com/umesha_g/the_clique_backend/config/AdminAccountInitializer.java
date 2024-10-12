package com.umesha_g.the_clique_backend.config;

import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.Role;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements CommandLineRunner {

    private  UserRepository userRepository;
    private  PasswordEncoder passwordEncoder;

    @Autowired
    public AdminAccountInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            Dotenv dotenv = Dotenv.load();

            String email = dotenv.get("ADMIN_EMAIL");
            String password = dotenv.get("ADMIN_PASSWORD");
            String firstName = dotenv.get("ADMIN_FIRST_NAME");
            String lastName = dotenv.get("ADMIN_LAST_NAME");

            if (email != null && password != null && firstName != null && lastName != null) {
                User adminUser = new User();
                adminUser.setEmail(email);
                adminUser.setPassword(passwordEncoder.encode(password));
                adminUser.setFirstName(firstName);
                adminUser.setLastName(lastName);
                adminUser.setRole(Role.ADMIN);

                userRepository.save(adminUser);

                System.out.println("Admin account created successfully!");
            } else {
                System.out.println("Admin account creation failed. Please check your .env file.");
            }
        }
    }
}
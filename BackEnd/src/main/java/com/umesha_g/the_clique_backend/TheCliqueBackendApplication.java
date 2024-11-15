package com.umesha_g.the_clique_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TheCliqueBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(TheCliqueBackendApplication.class, args);
	}

}

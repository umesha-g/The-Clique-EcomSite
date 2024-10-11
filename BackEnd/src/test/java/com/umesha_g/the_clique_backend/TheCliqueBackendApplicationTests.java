package com.umesha_g.the_clique_backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;

@SpringBootTest
class TheCliqueBackendApplicationTests {

	@Autowired
	private ApplicationContext applicationContext;

	@Test
	void contextLoads() {
		assertNotNull(applicationContext);
	}
}

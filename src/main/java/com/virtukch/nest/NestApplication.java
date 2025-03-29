package com.virtukch.nest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class NestApplication {

    public static void main(String[] args) {
        SpringApplication.run(NestApplication.class, args);
    }

}
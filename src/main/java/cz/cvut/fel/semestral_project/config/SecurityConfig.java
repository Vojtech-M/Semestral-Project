package cz.cvut.fel.semestral_project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


public class SecurityConfig {

    @Bean
    public String securityConfig() {
        return "Security configuration bean";
    }
}
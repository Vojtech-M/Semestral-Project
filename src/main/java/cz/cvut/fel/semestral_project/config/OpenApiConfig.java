package cz.cvut.fel.semestral_project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Robosoutěž REST API")
                        .version("1.0.0")
                        .description("Přehled a dokumentace REST API pro registraci týmů, správy škol, výpůjček a soutěžních termínů Robosoutěže.")
                        .contact(new Contact()
                                .name("Vojtěch Michal")
                                .email("vojtamichal04@gmail.com")));
    }
}

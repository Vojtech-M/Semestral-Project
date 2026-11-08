# Agent Instructions for Semestral Project Repository

This repository contains a Spring Boot application for a team registration system (Robosoutěž).

## Core Architecture
- **Language/Framework**: Java 21, Spring Boot 4.1.2.
- **Build System**: Gradle (Wrapper provided: `./gradlew`).
- **Persistence**: Spring Data JPA.
- **Databases**:
    - PostgreSQL (production)
    - H2 (local development/testing)
- **UI**: Thymeleaf templates (standard Spring Boot MVC).

## Essential Commands

### Build
- Build JAR: `./gradlew bootJar`

### Development & Run
- Run with Docker: `docker-compose up --build`
- Stop Docker: `docker-compose down`

### Testing
- Run tests: `./gradlew test` (Uses JUnit Platform)

## Development Guidelines & Conventions
- **Project Structure**: Standard Maven/Gradle layout under `src/main/java/cz/cvut/fel/semestral_project/`.
- **Dependencies**: Lombok is used for boilerplate (annotations: `@Data`, etc.). Ensure your editor supports the Lombok annotation processor if you modify models.
- **Database**: The project is designed to work with H2 for local development. If you need to debug data schema, check the configured H2 console or logs.
- **Docker**: The `Dockerfile` and `docker-compose.yml` are the primary way to run the application for end-to-end verification.

## Gotchas
- **Lombok**: If the project fails to compile due to missing getters/setters, ensure the annotation processor is correctly configured in your environment.
- **Java Version**: The project explicitly uses Java 21 via Gradle toolchain. Ensure your local environment matches this.

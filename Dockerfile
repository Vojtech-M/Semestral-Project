# 1. Krok: Sestavení aplikace pomocí Gradle s Javou 21
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

# 2. Krok: Spuštění hotové aplikace přes Java 21 JRE
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
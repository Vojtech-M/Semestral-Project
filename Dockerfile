# 1. Krok: Sestavení aplikace pomocí Gradle s Javou 21
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY . .

# Instalace novějšího Node.js a sestavení frontendu
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app/frontend
RUN npm install && npm run build

# Přesunutí sestaveného frontendu do static složky Spring Bootu
WORKDIR /app
RUN mkdir -p src/main/resources/static && cp -r frontend/dist/* src/main/resources/static/

# Přidání práva pro spuštění souboru gradlew (oprava chyby Permission denied)
RUN chmod +x gradlew

RUN ./gradlew bootJar --no-daemon

# 2. Krok: Spuštění hotové aplikace přes Java 21 JRE
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

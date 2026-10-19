# syntax=docker/dockerfile:1
# Imagen de un microservicio Spring Boot (mismo archivo en todos los módulos del backend)

FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
# Caché de Maven compartida entre todos los microservicios: cada dependencia se descarga una sola vez
RUN --mount=type=cache,target=/root/.m2,sharing=locked mvn -B -q dependency:resolve
COPY src src/
RUN --mount=type=cache,target=/root/.m2,sharing=locked mvn -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
LABEL description="Microservicio Clínica Agenda Médica"
EXPOSE 8080
# Los chequeos de salud se definen en docker-compose.yml para los servicios que lo necesitan
ENTRYPOINT ["java", "-jar", "app.jar"]

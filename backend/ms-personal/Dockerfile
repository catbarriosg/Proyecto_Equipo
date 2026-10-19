# ====================================
# DOCKERFILE - Microservicios SmartHealth
# ====================================
# Estructura: Multi-stage build
# Etapa 1: Compilación con Maven
# Etapa 2: Runtime con OpenJDK 21

FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copiar pom.xml y descargar dependencias (cacheable layer)
COPY pom.xml .
RUN mvn dependency:resolve

# Copiar código fuente
COPY src src/

# Compilar sin ejecutar tests (ya se ejecutan en CI/CD)
RUN mvn clean package -DskipTests

# ====================================
# Etapa 2: Runtime (imagen pequeña)
# ====================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar JAR compilado desde builder
COPY --from=builder /build/target/*.jar app.jar

# Metadatos
LABEL description="SmartHealth Microservicio"
LABEL version="1.0"

# Puerto (cambia según microservicio: 8081, 8082, 8083, etc.)
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher --check-health

# Comando para iniciar
ENTRYPOINT ["java", "-jar", "app.jar"]

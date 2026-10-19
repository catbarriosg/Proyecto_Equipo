FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:resolve
COPY src src/
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
LABEL description="SmartHealth Microservicio"
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher
ENTRYPOINT ["java", "-jar", "app.jar"]

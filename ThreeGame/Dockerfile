# Usa l'immagine di OpenJDK
FROM openjdk:21-jdk-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia il file JAR dell'app Spring Boot
COPY target/ThreeGame-0.0.1-SNAPSHOT.jar app.jar

COPY env.properties ./
# Espone la porta dell'app Spring Boot
EXPOSE 8080

# Comando per eseguire l'app
ENTRYPOINT ["java", "-jar", "app.jar"]

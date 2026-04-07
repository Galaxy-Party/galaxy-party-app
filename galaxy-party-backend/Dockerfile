# ---------- Stage 1 : Build ----------
FROM maven:3.9.14-eclipse-temurin-25 AS build

WORKDIR /build

# Copier les fichiers Maven
COPY pom.xml .

# Télécharger les dépendances (optimise le cache docker)
RUN mvn -B -q -e -DskipTests dependency:go-offline

# Copier le code source
COPY src ./src

# Builder le jar
RUN mvn clean package -DskipTests


# ---------- Stage 2 : Runtime ----------
FROM eclipse-temurin:25-jdk

WORKDIR /app

# Copier le jar généré depuis le stage build
COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
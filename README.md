
<h1 align="center">Taller 6 Patrones-arquitecturales</h1>

Pequeña aplicación full-stack para gestionar propiedades inmobiliarias con CRUD completo.

# Resumen y funcionalidad

### Tecnologías principales

Backend: Spring Boot 3, Spring Web, Spring Data JPA, Validation, MySQL Driver

DB: MySQL (RDS en AWS)

Frontend: HTML + JavaScript (Fetch API)

Infra: Backend en EC2, Base de datos en RDS (servidores separados)

### Qué permite

Crear, listar, consultar, actualizar y eliminar propiedades.

Validación en servidor (Bean Validation) y cliente (HTML5/JS).

CORS configurado para consumir desde el frontend.

### Atributos del recurso Property

id (autogenerado), address, price, size, description.

#### Endpoints REST (resumen)
Método	Ruta	Descripción
  - POST	/api/properties	Crear propiedad
  - GET	/api/properties	Listar todas
  - GET	/api/properties/{id}	Consultar por id
  - PUT	/api/properties/{id}	Actualizar por id
  - DELETE	/api/properties/{id}	Eliminar por id

# Estructura de archivos
### Backend (Spring Boot)
```bash
├─ pom.xml
├─ src/main/java/com/example/properties/
│  ├─ PropertiesApplication.java
│  ├─ config/
│  │  └─ CorsConfig.java
│  ├─ controller/
│  │  └─ PropertyController.java
│  ├─ dto/
│  │  ├─ PropertyRequest.java
│  │  └─ PropertyResponse.java
│  ├─ entity/
│  │  └─ Property.java
│  ├─ exception/
│  │  ├─ GlobalExceptionHandler.java
│  │  └─ NotFoundException.java
│  ├─ repository/
│  │  └─ PropertyRepository.java
│  └─ service/
│     └─ PropertyService.java
└─ src/main/resources/
   ├─ application.properties
   └─ data.sql     (opcional)
```
En proyecto spring
```bash
server.port=8080

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/propertiesdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC}
spring.datasource.username=${DB_USER:admin}
spring.datasource.password=${DB_PASS:*******}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.time_zone=UTC
```

### Frontend (HTML + JS)
```bash
frontend/
├─ index.html    
└─ app.js          
```

# ☁️ Despliegue en AWS
### Crear MySQL en RDS

1) RDS (MySQL)
  - Engine: MySQL 8.x, clase db.t3.micro/db.t4g.micro.
  - DB inicial: propertiesdb.
  - Security Group RDS (sg-rds):
    * Inbound 3306 desde el Security Group de EC2 (sg-ec2-backend).
    * permitir My IP, luego quitar.

2) EC2 (backend)
  - AMI: Amazon Linux 2023.
  - Security Group EC2 (sg-ec2-backend):
      * Inbound 22/SSH: My IP
      * Inbound 8080/TCP: My IP

### Instalar Java y probar la DB desde EC2
- sudo dnf update -y
- sudo dnf install -y java-17-amazon-corretto mysql
- mysql -h ec2-user@database-1.cvqoea44etk0.us-east-1.rds.amazonaws.com -u admin -p -e "SELECT 1;"

# Construir el JAR y subirlo
En mi pc:
```bash
mvn -q -DskipTests package
scp -i "C:\ruta\My_crud.pem" "target\CRUD_SystemManageProperties-0.0.1-SNAPSHOT.jar" ec2-user@<EC2_PUBLIC_DNS>:/home/ec2-user/
```

# Pruebas
http://ec2-user@database-1.cvqoea44etk0.us-east-1.rds.amazonaws.com:8080/api/properties

# Imagen 
<img width="1886" height="983" alt="Captura de pantalla 2025-09-21 184251" src="https://github.com/user-attachments/assets/7afe5d2e-5a99-42ac-9f0d-0bf63e73a0eb" />


### EC2
<img width="1888" height="670" alt="Captura de pantalla 2025-09-21 184706" src="https://github.com/user-attachments/assets/fce6a854-c285-462f-a941-1a431bae6c53" />

### RDS
<img width="1902" height="704" alt="Captura de pantalla 2025-09-21 184656" src="https://github.com/user-attachments/assets/59f4194f-8928-4a68-9932-0fcf59407608" />





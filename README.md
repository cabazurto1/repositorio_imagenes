# repositorio_IMG

Este proyecto es un **repositorio de imágenes** que permite a usuarios subir fotos sin autenticación, y a un administrador aprobar o rechazar dichas imágenes. La aplicación está compuesta por un **backend** (Node + Express), una **base de datos** (MongoDB) y un **frontend** (React + Nginx), todo orquestado con **Docker Compose**.

---

# Estructura del Proyecto: Repositorio de Fotos

proyecto:
  descripcion: >
    Este proyecto está dividido en dos partes principales: Frontend (client) y Backend (server).
    A continuación, se detalla la estructura de los directorios y archivos.
```
  frontend:
    descripcion: >
      Contiene todos los archivos relacionados con la interfaz de usuario.
    estructura:
      - dist/: Archivos generados después del build
      - node_modules/: Dependencias de Node.js para el frontend
      - public/:
          - index.html: Punto de entrada HTML del proyecto
      - src/:
          - assets/: Recursos estáticos (imágenes, íconos, etc.)
          - components/: Componentes principales de React
            - AdminDashboard.jsx
            - Carousel.jsx
            - Header.jsx
            - Login.jsx
            - MainMenu.jsx
            - ProtectedRoute.jsx
            - UploadImage.jsx
          - styles/: Archivos CSS para los componentes
            - AdminDashboard.css
            - App.css
            - Carousel.css
            - Header.css
            - Login.css
            - MainMenu.css
            - UploadImage.css
          - App.jsx: Componente principal del frontend
          - index.css: Estilos generales del proyecto
          - main.jsx: Archivo principal que inicializa React
      - Dockerfile: Archivo para construir la imagen Docker del frontend
      - .gitignore: Archivos/Directorios ignorados por Git
      - eslint.config.js: Configuración de ESLint
      - README.md: Documentación del proyecto

  backend:
    descripcion: >
      Contiene todos los archivos relacionados con la lógica del servidor y operaciones backend.
    estructura:
      - src/:
          - controllers/: Controladores del backend
            - imageController.js
          - middlewares/: Middlewares para funcionalidades específicas
            - authMiddleware.js
            - fileUpload.js
          - models/: Modelos de la base de datos
            - Admin.js
            - Image.js
          - routes/: Definición de rutas del backend
            - adminRoutes.js
            - imageRoutes.js
          - uploads/: Carpeta para imágenes subidas temporalmente
            - ejemplo-imagen.png
          - app.js: Archivo principal del backend
      - node_modules/: Dependencias de Node.js para el backend
      - .env: Variables de entorno
      - docker-compose.yml: Configuración de Docker Compose
      - Dockerfile: Archivo para construir la imagen Docker del backend
      - package.json: Configuración y dependencias del proyecto
      - package-lock.json: Detalles de las dependencias del proyecto
      - .gitignore: Archivos/Directorios ignorados por Git
```

caracteristicas:
  - Frontend: >
      Desarrollado con React para gestionar la interacción del usuario.
  - Backend: >
      Construido con Node.js y Express para gestionar la lógica de negocio y las operaciones relacionadas con las imágenes.
  - Docker: >
      Implementación de contenedores para el despliegue del proyecto.


## Estructura de Carpetas
```
repositorio-fotos/
  ├─ server/
  │   ├─ src/
  │   │   ├─ controllers/
  │   │   │   └─ imageController.js
  │   │   ├─ models/
  │   │   │   └─ Image.js
  │   │   ├─ routes/
  │   │   │   └─ imageRoutes.js
  │   │   ├─ middlewares/
  │   │   │   └─ fileUpload.js
  │   │   └─ app.js
  │   ├─ Dockerfile
  │   └─ package.json
  ├─ client/
  │   ├─ public/
  │   │   └─ index.html
  │   └─ src/
  │       ├─ index.js
  │       └─ App.js
  │   ├─ Dockerfile
  │   └─ package.json
  ├─ docker-compose.yml
  └─ .env
```
- **server**: Código del backend (Node/Express).  
- **client**: Código del frontend (React), servido con Nginx.  
- **docker-compose.yml**: Orquesta los contenedores de MongoDB, servidor y cliente.
- **.env**: Contiene variables de entorno (p. ej., conexión a Mongo, tamaño de archivo máximo, etc.).

---


## Docker Compose

Un ejemplo de `docker-compose.yml` para levantar los servicios:

```yaml
version: "3"

services:
  mongo:
    image: mongo:6
    container_name: my_mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
    volumes:
      - mongo_data:/data/db

  server:
    build: ./server
    container_name: my_server
    restart: unless-stopped
    ports:
      - "4000:4000"
    depends_on:
      - mongo
    env_file:
      - .env
    volumes:
      - ./server/src/uploads:/usr/src/app/src/uploads

  client:
    build: ./client
    container_name: my_client
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - server

volumes:
  mongo_data:
```

- **mongo**: Base de datos MongoDB, expuesta en el puerto 27017.
- **server**: Node/Express, expuesto en el puerto 4000.
- **client**: React + Nginx, expuesto en el puerto 3000 (mapeo 80 interno → 3000 host).

---

## Pasos para Ejecutar

1. Clona este repositorio o descárgalo.
2. Asegúrate de tener Docker y Docker Compose instalados.
3. Desde la carpeta raíz, corre:

```bash
docker-compose build
docker-compose up
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el frontend.

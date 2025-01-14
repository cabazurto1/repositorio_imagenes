# repositorio_IMG

Este proyecto es un **repositorio de imágenes** que permite a usuarios subir fotos sin autenticación, y a un administrador aprobar o rechazar dichas imágenes. La aplicación está compuesta por un **backend** (Node + Express), una **base de datos** (MongoDB) y un **frontend** (React + Nginx), todo orquestado con **Docker Compose**.

---

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

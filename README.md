# WebApp APIs - Proyecto CI/CD

API REST con flujo profesional: desarrollo, pruebas, contenedorización y despliegue automático en AWS EC2.

## Arquitectura
```
GitHub (push a main)
  -> GitHub Actions: test (Jest + coverage 70%)
  -> Docker Hub: build :latest + :sha
  -> EC2: ssh pull + docker run 80:80 y 6061:6061
```

## Endpoints (6+)
- GET / 
- GET /api/health
- GET /api/stats
- GET /api/users, GET /api/users/:id, POST /api/users, PUT /api/users/:id, DELETE /api/users/:id
- GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id
- POST /api/backup, DELETE /api/database/empty
- TCP Socket 6061: {insert:{"name":"...","email":"..."}} y {get:users}

## Comandos locales
```bash
npm install
npm run dev
npm test
npm run test:coverage
docker build -t webapp .
docker run -d -p 80:80 -p 6061:6061 --name webapp-container webapp
```

## Configuración necesaria
### Docker Hub PAT
Docker Hub -> Account Settings -> Security -> New Access Token (Read, Write, Delete)

### GitHub Secrets (Settings -> Secrets and variables -> Actions -> New repository secret)
- DOCKER_USERNAME: tu usuario de Docker Hub (ej: luisolascoaga)
- DOCKER_TOKEN: el PAT que creaste
- EC2_HOST: IP publica de tu EC2 (ej: 3.22.75.32)
- EC2_USER: ubuntu (si es Ubuntu) o ec2-user
- EC2_SSH_KEY: contenido completo del .pem (incluye -----BEGIN RSA PRIVATE KEY-----)

### EC2
1. Lanzar Ubuntu 22.04 t2.micro
2. Security Group: abrir 22 (SSH), 80 (HTTP), 6061 (TCP Socket)
3. Instalar Docker:
```bash
sudo apt update
sudo apt install docker.io -y
sudo usermod -aG docker $USER
sudo systemctl enable docker
```

## Demostración en vivo
Hacer un git push cambiando mensaje en GET / y ver en Actions como se ejecutan tests, se publica en Docker Hub y se actualiza EC2.

## Autor
Luis Olascoaga - UTEQ

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /app/data /app/backups

# Puerto para la API HTTP
EXPOSE 80

# Puerto para el servidor Socket TCP
EXPOSE 6061

ENV PORT=80
CMD ["npm", "start"]

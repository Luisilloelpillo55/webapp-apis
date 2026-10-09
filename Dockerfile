FROM public.ecr.aws/docker/library/node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force
COPY . .
RUN mkdir -p data backups
EXPOSE 80 6061
CMD ["node", "src/app.js"]

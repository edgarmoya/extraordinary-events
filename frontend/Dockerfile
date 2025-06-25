# --- /hechos-extraordinarios-nuevo/frontend/Dockerfile ---

# Utiliza una imagen base de Node.js para construir la aplicación React
FROM node:18-slim AS builder

WORKDIR /app

# Copia package.json y package-lock.json y luego instala las dependencias
COPY frontend/package*.json ./ 
RUN npm install

# Copia el resto de los archivos de la aplicación React
COPY frontend/ ./  

# Construye la aplicación React optimizada para producción
RUN npm run build

# --- Etapa final: Servir la aplicación con Nginx ---
FROM nginx:alpine

# Copia la configuración de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos de la aplicación React construida desde la etapa anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Exponer el puerto 80 para Nginx
EXPOSE 80

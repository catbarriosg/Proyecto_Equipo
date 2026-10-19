# Etapa 1: compilar la aplicación React con Vite
FROM node:22-alpine AS compilacion
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# En el contenedor el frontend usa siempre la API real a través de nginx
ENV VITE_USE_API=true
RUN npm run build

# Etapa 2: servir los archivos estáticos con nginx
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compilacion /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

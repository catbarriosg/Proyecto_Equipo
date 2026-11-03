# Imagen ligera de nginx para servir el sitio estatico
FROM nginx:1.27-alpine

# Configuracion propia del servidor
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Archivos del sitio
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY img/ /usr/share/nginx/html/img/
COPY paginas/ /usr/share/nginx/html/paginas/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

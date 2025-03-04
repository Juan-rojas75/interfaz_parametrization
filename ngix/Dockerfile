# Usa la imagen oficial de Nginx
FROM nginx:latest

# Copia la configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
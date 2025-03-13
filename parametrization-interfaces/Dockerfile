# Usa una imagen base oficial de Node.js
FROM node:18-alpine AS builder

# Define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json e instala dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Producción: Usa una imagen más ligera
FROM node:18-alpine

WORKDIR /app

# Copia solo los archivos necesarios desde la imagen builder
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next/static /app/.next/static

# Expone el puerto de Next.js
EXPOSE 3000

# Ejecuta la aplicación
CMD ["npm", "run", "start"]

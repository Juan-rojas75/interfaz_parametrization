# Usa Node.js como base
FROM node:18-alpine AS builder

WORKDIR /app

# Copia los archivos necesarios y ejecuta npm install
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código y compila TypeScript
COPY . .
RUN npm run build

# Segunda etapa: Imagen más ligera
FROM node:18-alpine

WORKDIR /app

# Copia archivos desde la imagen builder
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist /app/dist

EXPOSE 3001

CMD ["node", "dist/main"]

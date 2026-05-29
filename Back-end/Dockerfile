# Usamos una versión ligera de Node.js
FROM node:20-alpine

# Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código del back
COPY . .

# Exponemos el puerto 3000 que usa tu servidor
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "dev"]
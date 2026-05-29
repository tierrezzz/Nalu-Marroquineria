FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite usa el 5173 por defecto
EXPOSE 5173

# Necesitamos que Vite escuche en todas las interfaces para Docker
CMD ["npm", "run", "dev", "--", "--host"]
# Используем официальный образ Node.js для сборки
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Собираем фронтенд (замени на свою команду, если нужно)
RUN npm run build

# Используем лёгкий nginx для раздачи статики
FROM nginx:alpine

# Копируем собранные файлы из стадии builder в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Удаляем дефолтный конфиг nginx (опционально)
RUN rm /etc/nginx/conf.d/default.conf

# Копируем свой конфиг nginx (если есть)
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
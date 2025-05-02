FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon && npm install
COPY . .
CMD ["nodemon", "--inspect=0.0.0.0:9229", "src/app.js"]
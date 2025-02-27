FROM node:18
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5121
CMD ["npm", "start"]

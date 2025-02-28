# Use Node.js to build the frontend
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx to serve static files
FROM nginx:latest
WORKDIR /etc/nginx/conf.d/

# Copy static build files to Nginx root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 8094
CMD ["nginx", "-g", "daemon off;"]

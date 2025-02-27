# Use official Node.js image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose the port for the frontend (default Vite port)
EXPOSE 3000

# Start the frontend server
CMD ["npm", "run", "dev"]

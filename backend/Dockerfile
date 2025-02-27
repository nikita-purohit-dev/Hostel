# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies first
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire backend project
COPY . .

# Expose the correct port
EXPOSE 5111

# Start the application
CMD ["npm", "start"]

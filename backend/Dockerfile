# Use Node.js 20 on Alpine Linux for a small image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the backend runs on
EXPOSE 8080

# Start the application
CMD ["node", "app.js"]

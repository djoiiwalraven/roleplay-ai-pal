ARG NODE_VERSION=24.0.1

# Use an official Node.js runtime as a parent image
FROM node:${NODE_VERSION}

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install the app dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 (React default)
EXPOSE 3000

# Start the React app using serve (we'll use a simple static file server)
RUN npm install -g serve
CMD ["serve", "-s", "dist","-l", "3000"]

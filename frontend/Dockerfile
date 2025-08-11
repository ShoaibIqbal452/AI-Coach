FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with clean cache to avoid issues
RUN npm cache clean --force && \
    npm install --no-optional

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]

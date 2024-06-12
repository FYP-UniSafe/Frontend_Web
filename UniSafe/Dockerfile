# Stage 1: Build the Angular application
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install
# Alternatively, for a cleaner install, you could use `npm ci` which is more reliable for CI/CD environments
# RUN npm ci
# Installing Angular CLI globally is not necessary if it's already defined in package.json
# RUN npm install -g @angular/cli

# Copy the rest of the application code into the container
COPY . .

# Increase memory limit for Node.js to 8 GB to prevent out of memory errors during build
ENV NODE_OPTIONS=--max_old_space_size=8192

# Build the application for production
# The correct command is `npm run build -- --outputPath=./dist/out --configuration=production`
# Note: `npm build` is not a valid npm command for building Angular projects, and the `--configuration` flag should not have spaces around `=`
RUN npm run build -- --output-path=./dist/out --configuration=production

# Stage 2: Serve the application from Nginx
FROM nginx:latest

# Copy custom nginx configuration - this can be used to configure nginx as needed for the application
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app from the previous stage into the nginx server
COPY --from=build /app/dist/out/ /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# docker build -t unisafe-nodejs . 
# docker run -d -p 8080:80 unisafe-nodejs
# Start Nginx and serve the application
# CMD ["nginx", "-g", "daemon off;"]
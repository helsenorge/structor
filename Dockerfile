# Mulit-stage build
#   1. Build image (temporary)
#   2. Copy output from temporary image to runnable image
#
# Build with:
#   docker build -t helsenorge/skjemabygger .   
#
# Run with (example):
#   docker run -p 8090:80 --rm -it --name helsenorge-skjemabygger helsenorge/skjemabygger

### 1. Build image (temporary) ###
FROM node:14-bullseye-slim as build

    # Set the working directory to /src
    WORKDIR /src

    # Copy the package.json and package-lock.json files to the container
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code to the container
    COPY . .
    RUN npm run build --if-present

### 2 Runnable image ###
FROM nginx:1.21.0-alpine

    COPY --from=build /src/build /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
# Build stage
FROM node:20-alpine as build

# Define environment variables
ARG VITE_FRONTEND_URL
ARG VITE_BACKEND_URL
ARG VITE_RUNNER_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_AUDIENCE
ARG VITE_AUTH0_CLIENT_ID

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app for production with the environment variables
RUN VITE_FRONTEND_URL=$VITE_FRONTEND_URL \
    VITE_BACKEND_URL=$VITE_BACKEND_URL \
    VITE_RUNNER_URL=$VITE_RUNNER_URL \
    VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    npm run build

# Production stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
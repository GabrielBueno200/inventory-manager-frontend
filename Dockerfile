### Multi-stage Dockerfile for Vite React app
## Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Allow passing API base URL at build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

## Production stage: serve with nginx
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

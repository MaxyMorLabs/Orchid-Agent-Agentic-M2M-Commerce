FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest && npm ci
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

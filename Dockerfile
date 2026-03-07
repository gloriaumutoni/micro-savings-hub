FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./

COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 5000

CMD ["node", "app.js"]

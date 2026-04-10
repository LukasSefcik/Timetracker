FROM node:22-alpine

WORKDIR /app

# Frontend: install + build
COPY frontend/package.json frontend/package-lock.json frontend/
RUN cd frontend && npm ci
COPY frontend/ frontend/
RUN cd frontend && npx ng build --configuration production

# Backend: install
COPY backend/package.json backend/package-lock.json backend/
RUN cd backend && npm ci --include=dev
COPY backend/ backend/

EXPOSE 3000

CMD ["npx", "--prefix", "backend", "tsx", "backend/src/server.ts"]

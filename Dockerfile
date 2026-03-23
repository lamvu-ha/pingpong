# Example multi-stage Dockerfile
# Stage 1: Build the frontend (Vite)
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve backend & compiled frontend
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY main.py .
COPY --from=frontend-builder /app/dist /app/dist
# Alternatively, serve dist via Nginx, and run Python API separately
CMD ["python", "main.py"]

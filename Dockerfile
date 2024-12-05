###
### FRONTEND
###
FROM node:22-alpine as frontend

WORKDIR /app

# build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend .
RUN npm run build

###
### BACKEND
###
FROM node:22-alpine as backend

WORKDIR /app

# build
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend .
RUN npm run build

# clean
ENV NODE_ENV=production
RUN npm prune

# copy frontend
COPY --from=frontend /app/dist ./public

# RUN
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm","start"]

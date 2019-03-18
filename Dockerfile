# Step 1: Build project and run grunt tasks
FROM node:9.10 AS builder
WORKDIR /movie-build
COPY ./package* ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Copy build and install packages (skips devDependencies in production)
FROM node:9.10
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /movie
COPY ./package* ./
RUN npm install && npm cache clean --force
COPY --from=builder /movie-build .

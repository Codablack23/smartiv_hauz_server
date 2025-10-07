# syntax=docker/dockerfile:1.4

##########################################
# Stage 1: Builder (with Python & build tools)
##########################################
FROM node:20-slim AS builder

WORKDIR /smartiv_hauz_server

# Install build tools for native Node modules
RUN apt-get update && apt-get install -y \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Use build secrets if provided
RUN --mount=type=secret,id=env,target=/tmp/.env \
    sh -c "if [ -f /tmp/.env ]; then cp /tmp/.env .env; fi && npm run build"

##########################################
# Stage 2: Production (with Puppeteer)
##########################################
FROM node:20-slim AS production

WORKDIR /smartiv_hauz_server

# ---- Install system dependencies for Chromium ----
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-xcb1 \
    libxext6 \
    libxfixes3 \
    libnss3 \
    libxss1 \
    libxshmfence1 \
    libgtk-3-0 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# ---- Install production dependencies ----
COPY package*.json ./
RUN npm install --omit=dev

# ---- Copy build output ----
COPY --from=builder /smartiv_hauz_server/dist ./dist

# ---- Environment vars for Puppeteer ----
# This ensures Puppeteer downloads Chromium and uses the correct path
ENV PUPPETEER_SKIP_DOWNLOAD=false
ENV PUPPETEER_DISABLE_SANDBOX=true
ENV NODE_ENV=production

# ---- Expose app port ----
EXPOSE 3000

# ---- Start the app ----
CMD ["npm", "run", "start:prod"]

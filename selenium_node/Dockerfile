# Use a lightweight Node image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install required dependencies for Puppeteer + Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    lsb-release \
    xdg-utils \
    libu2f-udev \
    chromium \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose port (if needed)
EXPOSE 3000

# Start your app
CMD ["node", "server.js"]


# FROM ghcr.io/puppeteer/puppeteer:24.0.0

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# WORKDIR /usr/src/app

# # Install required dependencies for Puppeteer + Chromium
# RUN apt-get update && apt-get install -y \
#     wget \
#     ca-certificates \
#     fonts-liberation \
#     libappindicator3-1 \
#     libasound2 \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libcups2 \
#     libdbus-1-3 \
#     libx11-xcb1 \
#     libxcomposite1 \
#     libxdamage1 \
#     libxrandr2 \
#     libgbm1 \
#     libgtk-3-0 \
#     libnss3 \
#     libxss1 \
#     lsb-release \
#     xdg-utils \
#     libu2f-udev \
#     chromium \
#     --no-install-recommends && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# COPY package*.json ./
# RUN npm ci
# COPY . .
# CMD [ "node", "server.js" ]


# # Use a Node.js base image
# FROM node:18-bullseye

# # Install dependencies for Chrome
# RUN apt-get update && apt-get install -y \
#     wget gnupg unzip fonts-liberation libappindicator3-1 \
#     libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
#     libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
#     libxdamage1 libxrandr2 xdg-utils libu2f-udev libvulkan1 \
#     libgbm1 libxshmfence1 xvfb \
#  && rm -rf /var/lib/apt/lists/*

# # Install Chrome
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
#  && dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install

# # Set working directory
# WORKDIR /app

# # Copy and install app dependencies
# COPY package*.json ./
# RUN npm install

# # Copy app code
# COPY . .

# # Expose a port
# EXPOSE 3000

# # Start the app
# CMD ["node", "server.js"]

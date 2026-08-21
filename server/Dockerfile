FROM node:20-bookworm-slim

# better-sqlite3 compiles native C++ code at install time, so we need
# build tools present in the image (not required at runtime after that).
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy just the manifest first so `npm install` is cached by Docker
# and doesn't re-run every time you change a source file.
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
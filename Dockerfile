FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Copy frontend package files  
COPY Dowryclc/package*.json ./Dowryclc/

# Install dependencies for both
RUN cd backend && npm install && cd ../Dowryclc && npm install

# Copy all source files
COPY . .

# Build frontend
RUN cd Dowryclc && npm run build

EXPOSE 5000

CMD ["node", "backend/server.js"]

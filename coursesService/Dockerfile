FROM node:18
# Make new dir
RUN mkdir /app
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
COPY .env README.md ./
COPY src/ ./src
# Install dependencies
RUN npm install
# expose port 3000
EXPOSE ${PORT}
# Start the application
CMD ["npm", "start"]
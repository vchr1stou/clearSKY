FROM node:18
# Make new dir
RUN mkdir /app

WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
COPY .env README.md ./
COPY src/ ./src
# Install dependencies
RUN npm install
# expose port
EXPOSE ${PORT}
# Start the application
CMD ["npm", "start"]
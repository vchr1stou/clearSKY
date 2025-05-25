FROM node:18

# Ορίζουμε το working directory μέσα στο container
WORKDIR /app

# Αντιγράφουμε τα αρχεία package.json και package-lock.json (αν υπάρχει)
COPY package*.json ./

# Εγκαθιστούμε τις εξαρτήσεις
RUN npm install

# Αντιγράφουμε όλα τα υπόλοιπα αρχεία του microservice
COPY . .

# Ανοίγουμε την πόρτα 3000 (όπως τρέχει το app)
EXPOSE 3000

# Τρέχουμε το app (υποθέτω το κύριο αρχείο είναι app.js)
CMD ["node", "app.js"]

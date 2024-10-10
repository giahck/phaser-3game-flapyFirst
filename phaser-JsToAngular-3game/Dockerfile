# Usa l'immagine di Node.js per costruire l'app
FROM node:20 AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione del progetto
COPY package*.json ./

# Installa le dipendenze
RUN npm install && npm cache clean --force

# Installa Angular CLI globalmente
RUN npm install -g @angular/cli

# Copia il resto del codice
COPY . .

# Esegui la build dell'app Angular
RUN npm run build --prod

# Usa l'immagine Nginx per servire l'app
FROM nginx:alpine



COPY --from=builder /app/dist/phaser-js-to-angular-3game/browser /usr/share/nginx/html
# Copia il file di configurazione di Nginx
COPY my-angular-app.conf /etc/nginx/conf.d/default.conf

COPY fullchain.pem /etc/letsencrypt/live/giahck.it/fullchain.pem
COPY privkey.pem /etc/letsencrypt/live/giahck.it/privkey.pem

# Espone la porta 80
EXPOSE 80

EXPOSE 443

FROM nginx:alpine

# Copier les fichiers statiques déjà buildés
COPY dist /usr/share/nginx/html

# Config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

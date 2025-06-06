# etapa de compilación
FROM node:lts-alpine as build-stage

# Aqui es donde se colocará nuestra aplicacion en el contenedor.
WORKDIR /app

# Instalando librerias de alpine
RUN apk update && apk add bash git build-base \
    neovim openssl

# copiamos los archivos de configuracion  para la compilacion.
COPY package*.json ./

# instalacion del quasar cli
RUN npm install -g @quasar/cli

# se copia la aplicacion al workdir
COPY . .

# Instalacion de todas las dependencias
RUN npm install

# se compila la aplicacion
RUN quasar build

# etapa de producción
# use the lightweight Nginx image from the previous state to the nginx container
FROM nginx:stable-alpine as production-stage

# se copia la carpeta spa al directorio html de nginx
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# Copy the nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# se expone el puerto 80
EXPOSE 80

# se inicia el servicio nginx
CMD ["nginx", "-g", "daemon off;"]

# specify base image
FROM node:8

USER root

# set working directory 
RUN mkdir -p /app
WORKDIR /app

# copy files and install dependencies
COPY package.json package-lock.json .npmrc /app/
RUN npm install
COPY . .

# build
RUN npm run build-client

# specify which port to expose
EXPOSE 8080

USER USER

# start server
CMD ["npm", "start"]

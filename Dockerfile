# specify base image
FROM node:8

# set working directory 
RUN mkdir -p /app
WORKDIR /app

# copy files and install dependencies
COPY package.json package-lock.json /app/
RUN npm install
COPY . .

# build
RUN npm run build-client

# start server
CMD ["npm", "start", --bind 0.0.0.0:$PORT]

# Use an official Node.js runtime as a parent image
FROM node:14

# set working directory
RUN mkdir -p /app
WORKDIR /app

# copy files and install dependencies
COPY package.json package-lock.json /app/
RUN npm install
COPY . .

# build
RUN npm run build-client

EXPOSE 3004

CMD ["npm", "start"]

FROM node:20.0-alpine3.17

# Create app directory
WORKDIR /app

# install python and g++ usefull for some nodejs dependecies
RUN apk --no-cache add  \
    git \
    python3 \
    make \
    g++

COPY . .
RUN yarn install
RUN yarn run build

COPY .env /app/dist/

EXPOSE 3000
CMD ["yarn", "up"]
# CMD ["node", "/app/dist/server.js"]

FROM node:12.13.1-alpine
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY ./tsconfig.json ./tsconfig.json
COPY ./webpack.config.js ./webpack.config.js
COPY ./src ./src
RUN npm run build

FROM node:12.13.1-alpine
RUN apk --update add \
        docker
WORKDIR /app
COPY --from=0 /app/target/main.js /app/bin/main.js
ENTRYPOINT [ "node", "/app/bin/main.js" ]

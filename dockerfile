FROM node:15

WORKDIR /usr/src/app/

COPY ormconfig.ts package*.json tsconfig.json ./

COPY src/ ./src/

COPY assets/ ./assets/

RUN npm ci

ENV NODE_ENV production

CMD ["npm", "run", "docker-start"]
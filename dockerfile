FROM node:15

WORKDIR /usr/src/app/

COPY ormconfig.ts package*.json tsconfig.json ./

COPY src/ ./src/

RUN npm ci
RUN mkdir -p assets

ENV NODE_ENV production

CMD ["npm", "run", "docker-start"]
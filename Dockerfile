FROM node:18-alpine3.18 as deps
ARG WORKDIR=/app
WORKDIR $WORKDIR

# install container deps
RUN apk update && apk add curl git wget --no-cache

# install project deps
COPY package.json package-lock.json $WORKDIR
RUN npm ci

FROM deps as build
ARG WORKDIR=/app
WORKDIR $WORKDIR

RUN npm i -g @nestjs/cli

# build backend
COPY --from=deps $WORKDIR/node_modules $WORKDIR/node_modules
COPY ./ $WORKDIR
RUN npm run build
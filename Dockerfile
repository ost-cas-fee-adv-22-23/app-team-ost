# base image
FROM node:18-alpine AS base

# Install dependencies and build app
FROM base as build

ARG NPM_TOKEN

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc && \
    npm ci && \
    rm -rf .npmrc

COPY . .
COPY .env.deploy .env

RUN npm run build

# Production image and run app
FROM base as release

ARG BUILD_VERSION
ARG COMMIT_SHA
ARG NPM_TOKEN

ENV NODE_ENV=production \
    BUILD_VERSION=${BUILD_VERSION} \
    COMMIT_SHA=${COMMIT_SHA}

LABEL org.opencontainers.image.source="https://github.com/smartive-education/app-team-ost" \
    org.opencontainers.image.authors="Nando Schär und Martin Thomann" \
    org.opencontainers.image.url="https://github.com/smartive-education/app-team-ost" \
    org.opencontainers.image.documentation="https://github.com/smartive-education/app-team-ost/blob/main/README.md" \
    org.opencontainers.image.source="https://github.com/smartive-education/app-team-ost/blob/main/Dockerfile" \
    org.opencontainers.image.version="${BUILD_VERSION}" \
    org.opencontainers.image.revision="${COMMIT_SHA}" \
    org.opencontainers.image.licenses="Apache-2.0" \
    org.opencontainers.image.title="App Team-Ost" \
    org.opencontainers.image.description="This App is the result of the second part of the CAS Frontend Engineering Advanced course. It's our very own Twitter Clone - Mumble."

WORKDIR /app

RUN adduser -D appuser && \
    chown -R appuser /app

COPY --from=build /app/package.json /app/package-lock.json ./

RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc && \
    npm ci && \
    rm -rf .npmrc
    
COPY --from=build /app/.next ./.next

USER appuser

EXPOSE 3000

CMD ["npm", "run", "start"]
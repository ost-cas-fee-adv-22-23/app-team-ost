# base image
FROM node:18-alpine AS base

# Install dependencies and build app
FROM base as build

ARG NEXTAUTH_URL \
    NEXTAUTH_SECRET \
    ZITADEL_ISSUER \
    ZITADEL_CLIENT_ID \
    REVALIDATE_SECRET_TOKEN \
    NEXT_PUBLIC_QWACKER_API_URL \
    NEXT_PUBLIC_URL

ENV NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    ZITADEL_ISSUER=${ZITADEL_ISSUER} \
    ZITADEL_CLIENT_ID=${ZITADEL_CLIENT_ID} \
    REVALIDATE_SECRET_TOKEN=${REVALIDATE_SECRET_TOKEN} \
    NEXT_PUBLIC_QWACKER_API_URL=${NEXT_PUBLIC_QWACKER_API_URL} \
    NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc HUSKY=0 && npm ci

COPY . .

RUN npm run build

# Production image and run app
FROM base as release

WORKDIR /app

ARG BUILD_VERSION \
    COMMIT_SHA

ENV NODE_ENV=production \
    BUILD_VERSION=${BUILD_VERSION} \
    COMMIT_SHA=${COMMIT_SHA} \
    NEXT_TELEMETRY_DISABLED=1

LABEL org.opencontainers.image.source="https://github.com/smartive-education/app-team-ost" \
    org.opencontainers.image.authors="Nando Schär und Martin Thomann" \
    org.opencontainers.image.url="https://europe-west6-docker.pkg.dev/app-team-ost/team-ost-repo/app" \
    org.opencontainers.image.documentation="https://github.com/smartive-education/app-team-ost/blob/main/README.md" \
    org.opencontainers.image.source="https://github.com/smartive-education/app-team-ost/blob/main/Dockerfile" \
    org.opencontainers.image.version="${BUILD_VERSION}" \
    org.opencontainers.image.revision="${COMMIT_SHA}" \
    org.opencontainers.image.licenses="Apache-2.0" \
    org.opencontainers.image.title="App Team-Ost" \
    org.opencontainers.image.description="This App is the result of the second part of the CAS Frontend Engineering Advanced course. It's our very own Twitter Clone - Mumble."

RUN adduser -D appuser && \
    chown -R appuser /app

COPY --from=build --chown=appuser:appuser /app/public ./public
COPY --from=build --chown=appuser:appuser /app/.next/standalone ./
COPY --from=build --chown=appuser:appuser /app/.next/static ./.next/static

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
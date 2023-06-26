# Mumble App Team Ost

![Issues](https://img.shields.io/github/issues/smartive-education/app-team-ost)
![Pull Requests](https://img.shields.io/github/issues-pr/smartive-education/app-team-ost)

![Quality (Prettier, ESLint, Dependency Graph, Unit Test, Build)](https://github.com/smartive-education/app-team-ost/actions/workflows/quality.yml/badge.svg)
![Test (Build/Release Docker on Github Registry and e2e-Test)](https://github.com/smartive-education/app-team-ost/actions/workflows/test.yml/badge.svg)
![Release and Deploy on Google Cloud with Terraform](https://github.com/smartive-education/app-team-ost/actions/workflows/release-deploy.yml/badge.svg)

This App is the result of the second part of the CAS Frontend Engineering
Advanced course. It's our very own Twitter Clone - Mumble.

## Live Demo

The latest version of the App is available [here](https://app-team-ost-6cdrsmjqoa-oa.a.run.app/).

## Architecture, Rendering Strategies and Context

The detailed architecture, as well as decisions about the rendering strategy, can be found [here](./docs/app-architecture.md).

# Setup the project

## Authenticating GitHub Registry

1. Create a personal GitHub access token.
2. Create a new ~/.npmrc file if one doesn't exist.
3. Include the following line, replacing TOKEN with your personal access token.

```console
@smartive-education:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

Additional information can be found [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Next-App Installation

```console
npm ci
```

This installs:

- The design-system component-library from Team-Ost
- next
- next-auth
- next-pwa
- react, react-dom
- tailwindcss
- typescript
- swr
- ulid
- eslint, prettier, dependency cruiser for code quality
- husky, lint-staged as precommit hooks for linting/prettifying staged files

## Create Environment Variables

In the git repository you can find an example .env.example-file. You can use it to create your own .env-file in the root of the project. The following variables are needed:

```console
NEXT_PUBLIC_QWACKER_API_URL= { URL to the Qwacker API }
NEXTAUTH_URL= { Next-Auth URL => for local development: http://localhost:3000 }
NEXTAUTH_SECRET= { Next-Auth Secrect }
ZITADEL_ISSUER= { Zitadel Issuer URL }
ZITADEL_CLIENT_ID= { Zitadel Client ID => Is available in your account }
REVALIDATE_SECRET_TOKEN= { Revalidate API Secret }
NEXT_PUBLIC_URL= { Public URL of the application is used to create the share url => for local development: http://localhost:3000/ }
```

## Run/Build Project

The local next app runs on port 3000.
To start the dev-server run:

```console
npm run dev
```

To build the application local run:

```console
npm run build
```

This creates an optimized production build as a **standalone output** in the .next folder. You can start the build with:

```console
npm run start
```

**_NOTE:_**
Static sites (SSG, ISR) like the public timeline or mumble-page are rendered on build time. To test it you have to build and start this build. In development mode (npm run dev) this sites are generated on every request (like SSR sites).

## Docker

To run docker locally you have to build the image first (.env-file and .npmrc-file are needed):

```console
docker build --secret "id=npmrc,src=.npmrc" --build-arg="BUILD_VERSION=v0.0.1" --build-arg="COMMIT_SHA=1" --build-arg="NEXT_PUBLIC_URL=https://app-team-ost-6cdrsmjqoa-oa.a.run.app/" --build-arg="NEXT_PUBLIC_QWACKER_API_URL=https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/" --build-arg="NEXTAUTH_URL=https://app-team-ost-6cdrsmjqoa-oa.a.run.app" --build-arg="NEXTAUTH_SECRET=<your-secret>" --build-arg="ZITADEL_ISSUER=https://cas-fee-advanced-ocvdad.zitadel.cloud" --build-arg="ZITADEL_CLIENT_ID=<your-client-id>" -t europe-west6-docker.pkg.dev/app-team-ost/team-ost-repo/app .
```

After that you can run the image with:

```console
docker run --env-file=.env -p 3000:3000 europe-west6-docker.pkg.dev/app-team-ost/team-ost-repo/app
```

## Development and Conventions

### Conventional Commits

The commit message should be structured as follows:

```console
<type>[optional scope]: <description>
```

Types:
| **Type** | **Description** |
| :------------- | :------------------------------------------------------------------------------------------------------ |
| **build** | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) |
| **ci** | Changes to our CI configuration files and scripts |
| **docs** | Documentation only changes |
| **feat** | A new feature |
| **fix** | A bug fix |
| **perf** | A code change that improves performance |
| **refactor** | A code change that neither fixes a bug nor adds a feature |
| **style** | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| **test** | Adding missing tests or correcting existing tests |

Examples:

Commit message with scope:

```console
feat(lang): add German language
```

Commit message with ! to draw attention to breaking change:

```console
feat!: send an email to the customer when a product is shipped
```

### Scripts

#### ESLint

ESLint is configured to check:

- "@smartive/eslint-config/react"
- "next/core-web-vitals"
- "prettier"

```console
npm run lint
npm run lint:fix
```

#### Prettier

Prettier configuration:

- "@smartive/prettier-config"

```console
npm run format
npm run format:check
```

#### Dependency cruiser

Checks for dependency violations and create an svg graph

```console
npm run dep-graph:validate
npm run dep-graph:create-svg
```

## Testing

### Unit/Component Tests

Unit tests are written with Jest and React Testing Library. The tests are located in the component folders. The tests are executed in the CI/CD pipeline.

```console
npm run test
```

### E2E Tests

Critical user flows are tested with Playwright. The tests are located in the tests/e2e folder. The tests are executed in the CI/CD pipeline.

```console
npm run test-playwright:ui
```

After UI changes you can update the screenshots with:

```console
npm run test-playwright:update-snapshot
```

at the moment, only the logout page is snapshot tested.

## CI/CD

- Every pull request on the main branch triggers a quality check with prettier, eslint, dependency cruiser and unit tests. As well as a build.
- Every pull request on the main branch triggers a Docker build and release on Github Registry. This image is e2e tested locally on github.
- Every commit to the main branch triggers a build and deploy to the production environment on Google Cloud.

## Maintainer

- [Martin Thomann](https://github.com/mthomann)
- [Nando Schär](https://github.com/nschaer92)

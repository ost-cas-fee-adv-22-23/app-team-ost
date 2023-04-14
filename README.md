# Mumble App Team Ost

![Issues](https://img.shields.io/github/issues/smartive-education/app-team-ost)
![Pull Requests](https://img.shields.io/github/issues-pr/smartive-education/app-team-ost)
![Quality (Prettier, ESLint, Dependency Graph, Build)](https://github.com/smartive-education/app-team-ost/actions/workflows/quality.yml/badge.svg)
![Vercel Production Deployment](https://github.com/smartive-education/app-team-ost/actions/workflows/deploy.yml/badge.svg)

This App is the result of the second part of the CAS Frontend Engineering
Advanced course. It's our very own Twitter Clone - Mumble.

## Live Demo

The latest version of the App is available [here](https://app-team-ost.vercel.app/).

## Architecture: Rendering Strategies and Context

The detailed architecture, as well as decisions about the rendering strategy, can be found [here](./docs/app-architecture.md).

## Project Setup

### Installation

```console
npm install
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

### Create Environment Variables

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

### Run Project

The local next app runs on port 3000.
To start the dev-server run:

```console
npm run dev
```

To build the application local run:

```console
npm run build
```

and start the local build with:

```console
npm run start
```

**_NOTE:_**
Static sites (SSG, ISR) like the public timeline or mumble-page are rendered on build time. To test it you have to build and start this build. In development mode (npm run dev) this sites are generated on every request (like SSR sites).

## Development

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

## Maintainer

- [Martin Thomann](https://github.com/mthomann)
- [Nando Schär](https://github.com/nschaer92)

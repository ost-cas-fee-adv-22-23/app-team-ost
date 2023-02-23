# Mumble App Team Ost

![Issues](https://img.shields.io/github/issues/smartive-education/app-team-ost)
![Pull Requests](https://img.shields.io/github/issues-pr/smartive-education/app-team-ost)
![Quality (Prettier, ESLint, Dependency Graph, Build)](https://github.com/smartive-education/app-team-ost/actions/workflows/quality.yml/badge.svg)
![Vercel Production Deployment](https://github.com/smartive-education/app-team-ost/actions/workflows/deploy.yml/badge.svg)

This App is the result of the second part of the CAS Frontend Engineering
Advanced course. It's our very own Twitter Clone - Mumble.

## Live Demo

The latest version of the App is available [here](https://app-team-ost.vercel.app/).

## Development

```mermaid
C4Dynamic
    title Dynamic diagram for Internet Banking System - API Application

    ContainerDb(c4, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
    Container(c1, "Single-Page Application", "JavaScript and Angular", "Provides all of the Internet banking functionality to customers via their web browser.")
    Container_Boundary(b, "API Application") {
      Component(c3, "Security Component", "Spring Bean", "Provides functionality Related to signing in, changing passwords, etc.")
      Component(c2, "Sign In Controller", "Spring MVC Rest Controller", "Allows users to sign in to the Internet Banking System.")
    }
    Rel(c1, c2, "Submits credentials to", "JSON/HTTPS")
    Rel(c2, c3, "Calls isAuthenticated() on")
    Rel(c3, c4, "select * from users where username = ?", "JDBC")

    UpdateRelStyle(c1, c2, $textColor="red", $offsetY="-40")
    UpdateRelStyle(c2, c3, $textColor="red", $offsetX="-40", $offsetY="60")
    UpdateRelStyle(c3, c4, $textColor="red", $offsetY="-40", $offsetX="10")
```

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

## Maintainer

- [Martin Thomann](https://github.com/mthomann)
- [Nando Schär](https://github.com/nschaer92)

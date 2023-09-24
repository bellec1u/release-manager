# release-manager

The project provide a front app that enable any user to show the release status of different apps.

## Run the app

### Requirements

- Node v18
- A GitLab token with readonly access to the projects.
- A Jira account with readonly access to the ticket groups.

### Setup

The following files should be filled with the correct informations:
- `D:\projects\release-manager\frontend\src\environments\environment.ts`
- `D:\projects\release-manager\functions\release-extractor\func.yaml`

## Development

### Launch the infrastructure

In order to create the development environment, you just have to run:
```sh
docker-compose up -d
```

#### Initialize Microcks

In order to correctly init your Microcks env, you just have to import `D:\projects\release-manager\dev-environment\microcks-gitlab-api.yaml` through `http://localhost:8080/#/importers` > `Upload`.

### Launch the functions

For each used functions, run
```sh
# import all dependencies
npm install

# run the function
npm run start
```

### Launch the frontend

```sh
# import all dependencies
npm install

# run the app
npm run start:dev
```

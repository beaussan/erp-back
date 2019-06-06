# Erp back

[![CircleCI](https://circleci.com/gh/beaussart/erp-back/tree/master.svg?style=svg)](https://circleci.com/gh/beaussart/erp-back/tree/master)

## Description

This is the back-end of the erp project.

it's purpose is to help manager and have an archive of old masters maquettes and a place to manage them.

## Installation

```bash
$ npm install
$ cp example.env .env
```

## Running dependencies

To start a mongodb configured for this project, run the following docker-compose command :

```bash
$ docker-compose -f docker/dev.yml up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

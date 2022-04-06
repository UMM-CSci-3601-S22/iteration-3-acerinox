# Handy Pantry
### (Made by team Rocinante)


[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S22/it-2-rocinante?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S22/it-2-rocinante.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S22/it-2-rocinante/alerts/)

- [Handy Pantry](#handy-pantry)
    - [(Made by team Rocinante)](#made-by-team-rocinante)
  - [About Handy Pantry](#about-handy-pantry)
  - [Development](#development)
    - [Common commands](#common-commands)
  - [Deployment](#deployment)
  - [Resources](#resources)
  - [Contributors](#contributors)

## About Handy Pantry

Handy Pantry is a home pantry inventory management system, enabling the user to have an accurate idea of the current state of their pantry.

## [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

### Common commands

From the `server` directory:

- `./gradlew run` to start the server
- `./gradlew test` to test the server
- `./gradlew checkstyleMain` to run Checkstyle on the server Java code in the `src/main` folder
- `./gradlew checkstyleTest` to run Checkstyle on the server Java code in the `src/test` folder
- `./gradlew check` will run both the tests and Checkstyle in one command

From the `client` directory:

- `ng serve` to run the client
- `ng test` to test the client
  - Or `ng test --no-watch --code-coverage` to run the client tests once and
    also compute the code coverage.
- `ng e2e` and `ng e2e --watch` to run end-to-end tests

From the `database` directory:

- `./mongoseed.sh` (or `.\mongoseed.bat` on Windows) to seed the database

## [Deployment](DEPLOYMENT.md)

Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](DEPLOYMENT.md).

## [Resources](RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## Contributors

The contributors to this project can be seen [here](../../graphs/contributors).

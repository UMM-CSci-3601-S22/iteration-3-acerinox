![Handy Pantry](/res/Handy-Pantry-Main-Pic.png)
# Handy Pantry
#### By Team Rocinante


[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S22/iteration-3-acerinox?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S22/iteration-3-acerinox.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S22/iteration-3-acerinox/alerts/)

## Menu

  - [About Handy Pantry](#about-handy-pantry)
  - [Project Features](#project-features)
  - [Technical Specifications](#technical-specifications)
  - [Technical Document](#technical-document)
    - [Development](#development)
      - [Common commands](#common-commands)
    - [Deployment](#deployment)
  - [Resources](#resources)
  - [Known Issues & To-Do List](#known-issues--to-do-list)
  - [User Guide](#user-guide)
  - [Contributors](#contributors)

## About Handy Pantry

Handy Pantry is a home pantry inventory management system, enabling the user to have an accurate idea of the current state of their pantry.

## Project Features

The Handy Pantry gives you the ability to:
- Store and edit products containing information about things like brand, store, location, and product threshold amount.
- Search through a list of your products (by name, store, brand, and category).
- Add stored products to a digital pantry, or directly to a personal shopping list.
- Look through categorized dropdown tables of items in your pantry, with the ability to delete individual items.
- Choose between two shopping list views; interactive and print.
- Look through the interactive shopping list containing items added from your products list, sorted into store tabs.
- Regenerate your shopping list by threshold, adding products that aren't present in the pantry or that there aren't enough of.
- Delete individual items from your shopping list while in the interactive view.
- Click a button while in the print view to get a print-friendly shopping list.


## Technical Specifications



## Technical Document



### [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

#### Common commands

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

### [Deployment](DEPLOYMENT.md)

> Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](DEPLOYMENT.md).

## [Resources](RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## Known Issues & To-Do List



## User Guide



## Contributors

- <a href="https://github.com/albright220">Daniel Albright</a>
- <a href="https://github.com/cole-maxwell1">Cole Maxwell</a>
- <a href="https://github.com/jpwalbran">John Walbran</a>
- <a href="https://github.com/NikFBail">Nik Bailey</a>
- <a href="https://github.com/caidongting0823">Dongting Cai</a>
- <a href="https://github.com/CBeane313">Collin Beane</a>
- <a href="https://github.com/YuboMao">Yubo Mao</a>
- <a href="https://github.com/NicMcPhee">Nic McPhee</a>

The detail of contributors to this project can be seen [here](../../graphs/contributors).

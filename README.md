![Handy Pantry](/res/Handy-Pantry-Main-Pic.png)
# Handy Pantry
#### By Team Rocinante


[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S22/iteration-3-acerinox?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S22/iteration-3-acerinox.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S22/iteration-3-acerinox/alerts/)

## Table of Contents

  - [Live Demo](#live-demo)
  - [About Handy Pantry](#about-handy-pantry)
  - [Project Features](#project-features)
  - [Technical Specifications](#technical-specifications)
  - [Technical Document](#technical-document)
    - [Development](#development)
      - [Common commands](#common-commands)
    - [Deployment](#deployment)
  - [Resources](#resources)
  - [Known Issues & Roadmap](#known-issues--roadmap)
    - [Issues](#issues)
    - [Roadmap](#roadmap)
  - [User Guide](#user-guide)
  - [Contributors](#contributors)

## Live Demo
See a live demo of the handy pantry at https://159.223.190.88.nip.io/.

## About Handy Pantry

Handy Pantry is a home pantry inventory management system, enabling the user to have an accurate idea of the current state of their pantry and create a personalized shopping list based off of your grocery needs.

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

- **Languages used:** Typescript, Java, HTML and SCSS
- **Services used:** MongoDB, Digital Ocean, Docker
- **Frameworks:** Angular 13 and Javalin
- **Testing software:** Karma, Cypress, and GitHub Actions

### [Development](doc/DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](doc/DEVELOPMENT.md).

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

### [Deployment](doc/DEPLOYMENT.md)

> Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](doc/DEPLOYMENT.md).

## [Resources](doc/RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## Known Issues & Roadmap

### Issues
- Products and Pantry are being categorized client side, slowing site down - change to a database query
- Dates are being stored as strings (on server) - convert to storing as date objects

### Roadmap
- Add way to change individual item count in the shopping list
- Link items in the pantry and shopping list to the product listing


## User Guide

1. Load on to the My Pantry page
   1. On the pantry page, click on one of the categories to open a drop down menu displaying the pantry items or products in a drop down list
   2. On the pantry page, select the red 'x' to delete a pantry item
   3. On the pantry page, selecting a pantry item will open another drop down menu displaying the best before date
2. Click on the icon in top left corner next to page name to open the sidebar menu
3. In the sidebar, select the products name to navigate to the products page
   1. On the products page, click on one of the categories to open a drop down menu displaying the pantry items or products in a drop down list
   2. On the products page, the filters at the top of the page enable easy searching of a specific product
   3. On the products page, select a product to open up the card view
      1. From there, the user can either edit the product or add it to the pantry
   4. On the product page, the user can select to delete product, ad to pantry, or add to shopping list
   5. On the products page, the user can add a new product to the product page
4. On the shopping list page, the user can switch between the interactive view and the print view
    1. In the interactive view, the user can switch between stores
    2. In the interactive view, the user can delete items from the shopping list
    3. In the interactive view, the user can reset the shopping list
    4. In the print view, the user can select the orange print icon to print the page

## Contributors


- <a href="https://github.com/cole-maxwell1">Cole Maxwell</a>
- <a href="https://github.com/CBeane313">Collin Beane</a>
- <a href="https://github.com/albright220">Daniel Albright</a>
- <a href="https://github.com/caidongting0823">Dongting Cai</a>
- <a href="https://github.com/jpwalbran">John Walbran</a>
- <a href="https://github.com/NikFBail">Nik Bailey</a>
- <a href="https://github.com/YuboMao">Yubo Mao</a>
- <a href="https://github.com/krug0102">Zeke Krug</a>

Special thanks to:
- <a href="https://github.com/NicMcPhee">Nic McPhee</a>

<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">User Docs Management</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Write about 1-2 paragraphs describing the purpose of your project.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```bash
Before starting, make sure you have the following installed:
Node: Make sure you have installed Node
Git: Download Git
Docker: Install Docker
Includes Docker Compose in Docker Desktop installations.

```

### Installing

# Steps to get a development env running.

# Follow below steps to get running the apps

```bash
  $ git clone https://github.com/ShyamL1319/jkteck-user-docs.git

```
# Go to project directory jkteck-user-docs
```bash
  $ npm install #if you face any issue please include --leegacy-peer-deps
  $ npm run start:docker # it will start services like db pgadmin ui kafka and conduktor to manage and monitoring apps
  $ npm run start:dev #It will start your local server now you can hit local server or docker running services 
```
# Go to project directory jkteck-user-docs/ingestion-service
```bash
  $ npm install #if you face any issue please include --leegacy-peer-deps
  $ npm run start:dev #It will start your local server
```
# Connect DB via docker and ui in browser if you have installed use your local db config details

# Create .env.development file that will contains details like

```bash
APPNAME=Docs-User-Management-Application
APPVERSION=v1.0
APP_PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=**********
DATABASE_PASSWORD=**********
DATABASE_NAME=user_docs_management

POSTGRES_TEST_DB="user_docs_management_test"
POSTGRES_TEST_PORT=5432
MULTER_DEST='./uploads'
JWT_SECRET='*******'
PASSWORD_ENCRYTING_SALT='*****'

CONFLUENT_API_KEY='*********'
CONFLUENT_API_SECRET=********
KAFKA_BROKER_URL=kafka:19092
KAFKA_CLIENT_ID=document-producer-client-id
```

```bash
# development
$ npm run start:dev

# staging
$ npm run start:staging

# production mode
$ npm run start:prod

```

# You should see below output in the console.

```bsh
This application is running on: http://[::1]:3000
```
# Now import postman collection from post_collection.json  hit to register user and login try to get details using the access token recieved in login

## 🔧 Running the tests <a name = "tests"></a>
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🎈 Usage <a name="usage"></a>

Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>

Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
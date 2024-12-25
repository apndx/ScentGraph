# [ScentGraph](https://scent-graph.herokuapp.com/)

ScentGraph is a project for Helsinki University [Full Stack course](https://fullstackopen.com/en/). In 2020 it my Full Stack course project, and in 2023 it was used as a base for [Full Stack Part 11](https://fullstackopen.com/en/part11) exercise [11.20](https://fullstackopen.com/en/part11/expanding_further#exercises-11-19-11-21). ScentGraph is done using React and TypeScript for the front end, Node and TypeScript for the backend and [Neo4J](https://neo4j.com/) for graph database. The web application is hosted in [Heroku](https://scent-graph.herokuapp.com/). The [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) queries are done using Cypher. GitHub actions are used for CI and automated testing.

In ScentGraph users can add scents to the database. The scents can belong to various categories and the relations of scents, their categories and several scent properties can be visualized in a graph form.

ScentGraph has basic and admin users, and basic users can be created in the application. Admin users of ScentGraph can add properties that can be used in the scent creation.

I have used [Fragrantica](https://www.fragrantica.com/) as a big source for inspiration for the idea, terms and structure of this application, so big thanks for the Fragrantica community for their excellent site and blogs.

<img src="https://github.com/apndx/ScentGraph/blob/master/documentation/scent-graph-show-scents.png" width="800">

### Local Usage

For this application [an Aura DB instance](https://neo4j.com/cloud/platform/aura-graph-database/) should be running. You should also have .env file where url, username and password for Aura DB are defined:
```
AURA_BOLT_URL = neo4j+s://yourdbidentifier.databases.neo4j.io
AURA_USER = neo4j
AURA_PASSWORD = supersecretpassword
```
More details for setting up the database for ScentGraph can be found in the [database.md](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md).

### Commands

After cloning the repository these commands can be used in the repository root. The project works at least with the Node version v12.22.3.

Install dependencies:

```
npm install
```

Start application in [dev mode](http://localhost:3004/):

```
npm run start-dev
```

### Testing

At the moment some server and client helper functions are being unit tested. Also there is one route integration test. To run the integration test, an Aura DB instance should be running. The application frontend use has been manually tested on Crome browser, and there is a very simple browser test done with cypress.

To run tests against an Aura DB Neo4j:

```
npm run test-dev
```

To run browser tests with the GUI:

```
npm run cypress-open
```

To run browser tests with the CLI:

```
npm run cypress-run
```

To run lint check:

```
npm run lint
```

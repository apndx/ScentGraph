[ScentGraph](https://scent-graph.herokuapp.com/)

ScentGraph is a project for Helsinki University FullStack course. ScentGraph is done using React and TypeScript for the front end, Node and TypeScript for the backend and [Neo4J](https://neo4j.com/) for graph database. The web application will be hosted in Heroku. The [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) queries will be done using Cypher. GitHub actions are used for CI and automated testing.

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

Optionally, a local Neo4J can be started as a [Neo4J Docker](https://neo4j.com/developer/docker/) instance. Install and usage instructions for this can be found in the [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) introduction. For local use, the credential envs should be saved as:
```
GRAPHENEDB_BOLT_URL = bolt://localhost:7687
GRAPHENEDB_BOLT_USER = neo4j
GRAPHENEDB_BOLT_PASSWORD = supersecretpassword
```


### Commands

After cloning the repository these commands can be used in the repository root.

Install dependencies:

```
npm install
```

Start application in [local mode](http://localhost:3001/):

```
npm run start-local
```

### Testing

At the moment some server and client helper functions are being unit tested. Also there is one route integration test. To run the integration test, a local Neo4j instance should be running. The application frontend use has been manually tested on Crome browser.

To run tests against a local Neo4j:

```
npm run test-local
```

To run tests against an Aura DB Neo4j:

```
npm run test-dev
```

To run browser tests:

```
npm run cypress-open
```
   "cypress-open": "cypress open",
    "test-e2e": "cypress run",

To run lint check:

```
npm run lint
```

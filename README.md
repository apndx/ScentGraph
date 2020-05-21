# [ScentGraph](https://scentgraph.herokuapp.com/)

[![Build Status](https://travis-ci.org/apndx/ScentGraph.svg?branch=master)](https://travis-ci.org/apndx/ScentGraph)

ScentGraph is a project for Helsinki University FullStack course. ScentGraph is done using React and TypeScript for the front end, Node and TypeScript for the backend and [Neo4J](https://neo4j.com/) for graph database. The web application will be hosted in Heroku. The [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) queries will be done using Cypher and [neode](https://www.npmjs.com/package/neode). [Travis](https://travis-ci.org/) is used for CI and automated testing.

In ScentGraph users can add scents to the database. The scents can belong to various categories and the relations of scents, their categories and several scent properties can be visualized in a graph form.

ScentGraph has basic and admin users, and basic users can be created in the application. Admin users of ScentGraph can add properties that can be used in the scent creation.

I have used [Fragrantica](https://www.fragrantica.com/) as a big source for inspiration for the idea, terms and structure of this application, so big thanks for the Fragrantica community for their excellent site and blogs.

<img src="https://github.com/apndx/ScentGraph/blob/master/documentation/scent-graph-show-scents.png" width="800">

### [Hours](https://github.com/apndx/ScentGraph/blob/master/documentation/hourlist.md)

### Local Usage

For this application a local Neo4j instance should be running. You should also have .env file where url, username and password for Neo4J are defined with GRAPHENE variables, for example like this:

```
GRAPHENEDB_BOLT_URL = bolt://localhost:7687
GRAPHENEDB_BOLT_USER = neo4j
GRAPHENEDB_BOLT_PASSWORD = supersecretpassword
```

Local Neo4J can be started as a [Neo4J Docker](https://neo4j.com/developer/docker/) instance. Install and usage instructions for this can be found in the [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) introduction.

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

To run tests:

```
npm run test
```

To run lint check:

```
npm run lint
```

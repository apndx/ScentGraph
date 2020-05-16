# ScentGraph

ScentGraph is a project for Helsinki University FullStack course. ScentGraph is done using React and TypeScript for the front end, Node and TypeScript for the backend and [Neo4J](https://neo4j.com/) for graph database. The web application will be hosted in Heroku. The [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) queries will be done using Cypher and [neode](https://www.npmjs.com/package/neode).

In ScentGraph users can add scents to the database. The scents can belong to various categories and the relations of scents, different scent categories and several scent properties can be visualized in a graph form.

ScentGraph has basic and admin users, and basic users can be created in the application. Admin users of ScentGraph can add properties that can be used in the scent creation.

<img src="https://github.com/apndx/ScentGraph/blob/master/documentation/scent-graph-show-scents.png" width="800">

## [Hours](https://github.com/apndx/ScentGraph/blob/master/documentation/hourlist.md)

## Local Usage

For this application a local Neo4j instance should be running. You should also have .env file where url, username and password for Neo4J are defined with these variables:

```
GRAPHENEDB_BOLT_URL
GRAPHENEDB_BOLT_USER
GRAPHENEDB_BOLT_PASSWORD
```

For example like this (password in same form):

```
GRAPHENEDB_BOLT_URL = bolt://localhost:7687
GRAPHENEDB_BOLT_USER = neo4j

```

Local Neo4J can be started as a Docker instance:

```
docker pull neo4j:3.5.14
docker run \
    --name testneo4j3.5.14 \
    -p7474:7474 -p7687:7687 \
    -d \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/var/lib/neo4j/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=<your-neo4j-username>/<your-neo4j-password> \
    neo4j:3.5.14

```

## Commands

Start application in [local mode](http://localhost:3001/):
```
npm run start-local
```

### Testing

At the moment some server and client helper functions are being unit tested. Also there is one route integration test. To run the integration test, a local Neo4j instance should be running.

```
npm run test
```

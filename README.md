# ScentGraph

[![Build Status](https://travis-ci.org/apndx/ScentGraph.svg?branch=master)](https://travis-ci.org/apndx/ScentGraph)

ScentGraph is a project for Helsinki University FullStack course. ScentGraph is done using React and TypeScript for the front end, Node and TypeScript for the backend and [Neo4J](https://neo4j.com/) for graph database. The web application will be hosted in Heroku and user [Travis](https://travis-ci.org/) for automated testing. The [database](https://github.com/apndx/ScentGraph/blob/master/documentation/database.md) queries will be done using Cypher and [neode](https://www.npmjs.com/package/neode).

In ScentGraph users can add scents to the database. The scents can belong to various categories and the relations of scents, different scent categories and several scent properties can be visualized in a graph form.

ScentGraph has basic and admin users, and basic users can be created in the application. Admin users of ScentGraph can add properties that can be used in the scent creation.

## [Hours](https://github.com/apndx/ScentGraph/blob/master/documentation/hourlist.md)

## Commands

Start application in [local mode](http://localhost:3001/):
```
npm run start-local
```

### Testing

```
npm run test
```



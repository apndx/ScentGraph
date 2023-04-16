# ScentGraph Database

ScentGraph has Neo4J graph database, and more precicely [AuraDB](https://neo4j.com/cloud/platform/aura-graph-database/).

The database queries are done using [Cypher](https://neo4j.com/developer/cypher-query-language/) and [neode](https://www.npmjs.com/package/neode).

The queries used in ScentGraph can be found in project [routes](https://github.com/apndx/ScentGraph/tree/master/src/server/routes) codebase.

To start using ScentGraph, setup a new Aura DB, and start it. You can see the your database credentials from the new instance settings. You should also have .env file in the ScentGraph project root where url, username and password for Aura DB are defined:
```
AURA_BOLT_URL = neo4j+s://yourdbidentifier.databases.neo4j.io
AURA_USER = neo4j
AURA_PASSWORD = supersecretpassword
```

The database has some constraints, these can be added in the Aura instance cypher dashboard by running these commands:
```
CREATE CONSTRAINT FOR (season:Season) REQUIRE season.seasonname IS UNIQUE
CREATE CONSTRAINT FOR (brand:Brand) REQUIRE brand.brandname IS UNIQUE
CREATE CONSTRAINT FOR (note:Note) REQUIRE note.notename IS UNIQUE
CREATE CONSTRAINT FOR (time:TimeOfDay) REQUIRE time.timename IS UNIQUE
CREATE CONSTRAINT FOR (category:Category) REQUIRE category.categoryname IS UNIQUE
CREATE CONSTRAINT FOR (gender:Gender) REQUIRE gender.gendername IS UNIQUE
CREATE CONSTRAINT FOR (user:User) REQUIRE user.username IS UNIQUE

```

This new database instance is first empty, but after creating a user with the application, you can add admin status to it in the Aura dashboard
```
MATCH (u:User {username: '<your-application-user-name>'}) SET u.role = 'admin' RETURN u;
```

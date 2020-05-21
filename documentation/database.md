# ScentGraph Database

ScentGraph has Neo4J graph database, and more precicely [GrapheneDB](https://elements.heroku.com/addons/graphenedb) in Heroku.

The database queries are done using [Cypher](https://neo4j.com/developer/cypher-query-language/) and [neode](https://www.npmjs.com/package/neode).

The queries used in ScentGraph can be found in project [routes](https://github.com/apndx/ScentGraph/tree/master/src/server/routes) codebase.

The database has some constraints:
```
CREATE CONSTRAINT ON (season:Season) ASSERT season.seasonname IS UNIQUE
CREATE CONSTRAINT ON (brand:Brand) ASSERT brand.brandname IS UNIQUE
CREATE CONSTRAINT ON (note:Note) ASSERT note.notename IS UNIQUE
CREATE CONSTRAINT ON (time:TimeOfDay) ASSERT time.timename IS UNIQUE
CREATE CONSTRAINT ON (category:Category) ASSERT category.categoryname IS UNIQUE
CREATE CONSTRAINT ON (gender:Gender) ASSERT gender.gendername IS UNIQUE
CREATE CONSTRAINT ON (user:User) ASSERT user.username IS UNIQUE

```

## Local usage with Neo4J Docker

Creating a container (empty of nodes and relations) and starting it:
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

The creation can be verified:
```
docker ps
```

This new database instance is first empty, but after creating a user with the application, you can add admin status to it in the docker container using cypher shell with these commands:
```
docker exec -it testneo4j3.5.14 bash
cypher-shell -u <your-neo4j-username> -p <your-neo4j-password>
MATCH (u:User {username: '<your-application-user-name>'}) SET u.role = 'admin' RETURN u;
```

To exit the cypher cell:
```
:exit
```

The container can be stopped (without destroying it):
```
docker stop testneo4j3.5.14 
```

Starting the container again:
```
docker start testneo4j3.5.14
```

The container can be destroyed (data will be destroyed as well):
```
docker rm testneo4j
```

To exit the docker container simply command
```
exit
```

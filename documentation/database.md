# ScentGraph Database

ScentGraph has Neo4J graph database, and more precicely [GrapheneDB](https://elements.heroku.com/addons/graphenedb) in Heroku.

The database queries will be done using Cypher and [neode](https://www.npmjs.com/package/neode).

Schema:
<img src="https://github.com/apndx/ScentGraph/blob/master/documentation/schema.jpg" width="800">


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

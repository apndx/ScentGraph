# Hour list

| Day | Time | Task  |
| :----:|:-----| :-----|
| 15.1. | 1 | Starting project, reposition creation, reading project instructions |
| 19.1. | 3 | Reading Heroku / Neo4J / GrapheneDB documentation, local Neo4J installation, hello world to server side |
| 20.1. | 6 | User creation to Neo4J, also some hours of not very fruitful typescript configuration |
| 2.2. | 7 | TypeScript configurations to work. User router refactoring. Response needs still some work. |
| 7.2. | 3 | Error-handling to user route, starting user route testing |
| 8.2. | 6 | Starting client configurations |
| 9.2. | 3 | User creation form, starting nav-bar |
| 11.2. | 4,5 | Navbar and links, React bootstrap styles, logo, favicon. Client route refresh needs to be fixed. |
| 12.2. | 5 | Route not found fix. Heroku configurations started. |
| 13.2. | 2,5 | Heroku configured, users can be saved to Graphene database, new version of logo |
| 22.3. | 7,5 | Server route and rest request for login, started client login and logout |
| 23.3. | 1 | Fixing nav bar rendering, considering briefly using redux for state handling |
| 24.3. | 1,5 | Nav bar rendering fix finished, heroku login fixed with secret |
| 25.3. | 0,5 | Sketching schema |
| 28.3. | 1,5 | Route to add scent, additions to user creation |
| 29.3. | 4,5 | Admin routes to add and delete scent details, user role and delete routes |
| 31.3. | 1,5 | Authorizing middleware for scent and admin routes |
| 4.4. | 8,5 | Admin tool page and form for client, refactoring nav bar and login state |
| 5.4. | 2,5 | Admin state to Heroku user, testing feature in Heroku, note and brand models, model refactoring |
| 6.4. | 3 | Create scent dataclass, add scent now takes a brand name and creates a relation |
| 11.4. | 5 | Unique constraints to DB, DB documentation, scent to have relations to time, gender, season and category |
| 13.4. | 2,5 | Form for scent creation: scent has a name, and relations to time, season and gender |
| 14.4. | 3,5 | Route to get all categories, brands or notes, returns a list of names. Routes for brand and note creation, starting adding these to client side as well |
| 19.4. | 4,5| Fixing rendering bug, fetching all categories, notes and brands for scent creation, autofill form for category, relation to category added |
| 20.4. | 2| Brand is created, and the relation to brand. Better error handling for admin items, brand and note. |
| 21.4. | 3,5| In scent creation brand can be chosen from a list or added if not found. The relation of user who added the scent is saved with the scent. Starting all scents of a category route. |
| 25.4. | 2| All scents from category result is converted in scent route to fit visualisation |
| 26.4. | 5| Page to choose the category to view the scents from. Visualisation to show scents of category in a graph. |
| 3.5. | 4 | Heroku student dyno application and db cleanup. Graph canvas resizing. Node colors. Naming changes, considering CI options and Travis. |
| 4.5. | 8 | Travis configuration tests, trying to get Neo4J service or neo4j-docker to work with for Travis. Route add and delete tests for season routes. Reading about different CI tools.|
| 5.5. | 9,5 | Creating better notification and error handling. More general scent graph route, test for helper. Form to choose graph from category or brand. |
| 6.5. | 6,5 | Route for creating several notes at a time. Show scent button color change. Note adding page fetches all notes and scents, scent can be chosen and existing notes for it fetched. |
| 9.5. | 4,5 | Add note to scent form to have note addition input field. Route to relate note to a scent. Functional note addition form. |
| 10.5. | 6,5 | Notes shown more logically. Better route result messages. Planning and testing how to show notes in a graph. Implementing note as a graph search criteria. Buttons on show-graph page to have colors from used color schema. Lists bo be sorted alphabetically. |
| 13.5. | 3 | Button to toggle graph physics. Tooltip started: properties converted to node title. |
| 14.5. | 5 | Node tooltip formatted. Edge label not to show, tooltip provides same info. Fixed scent in scent add to use model. moment library to format timestamps (has open [issue](https://github.com/moment/moment/issues/5515) with showing months). Show scents to show scents from gender, season and time of day. Physics toggle improvement. |
| 15.5. | 5 | User can show the scent they have added in the scent graph. Button to filter different nodes from the graph, capability to have multiple filters, filter state persisted |
| 16.5. | 8,5 | Double clicking the scent node notes for that scent will be fetched. Tests for graph helper functions. Fixing bugs in filter persistance and updating unmounted components. Graph search by scent name and brand combo. Readme updates. Testing Neo4j-docker, refactoring client services according to usage. Travis CI back with Neo4j Docker. |
| 17.5. | 3 | Adding info link into nav bar, link redirects to my Github. Refactoring services/routes and env variables to more logical form. Info link redirecting improvement.|
| 18.5. | 8 | Installing and configuring tslint, fixing lint errors. Unit test for name transforming function. Fix for filter bug. Updating documentation. Removing moment library and parsing dates with other functions. Some tests for node transformation. |
| all | 172,5 | |

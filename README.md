# Short backend assessment

Deployed API url, https://clownfish-app-herbe.ondigitalocean.app/graphql


## Installation
Git clone this repository, ```https://github.com/owen-duncan-snobel/graphql-movies.git```
run ```docker-compose up --build``` from the root of the ```/``` folder

## Run migrations
For the db migrations run,

 ```npx prisma migrate dev --name init --schema ./mount/prisma/schema.prisma```
from the root folder ```/```.

 **YOU NEED TO RUN FROM THIS FOLDER TO ACCESS THE .env variables**
## Seed DB
to seed the db run, ```npx prisma db seed``` inside of the viral-nation docker terminal. 
Or, you can also try to run from the root of the ```mount/``` folder may recieve an error connecting to localhost:5432

## Prisma Studio
to open prisma studio run ```npx prisma studio  --schema ./mount/prisma/schema.prisma``` from the root of the /server folder. Does not seem to work in Firefox browser! (Safari and Chrome) 

## Authentication && Authorization
For the API, you must first register a user using the register mutation.
```
register(username: String!, password: String!, email: String!): AuthPayload!
```

For login use the login mutation.
```
login(email: String!, password: String!): AuthPayload!
```

From both of these mutations it will return an auth token which will need to be placed in your headers to make the various CRUD operations.

ex.
```Authorization: Bearer eyJhbGciOiJIUz...```

## Assumptions
For this API, it was assumed that duplicate movie names are allowed to be created. There are no constraints on the movie name to be "unique". It is also assumed you are able to create the same movie name with the same director n-times.

Dates returned from the server are in epoch milliseconds as a String

## Backlog

1. Continue Unit + Integration tests for the services + resolvers
2. Set up mocking for prisma + graphql 
3. Postman collection for the queries and mutations


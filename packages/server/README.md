
## Installation
run ```docker-compose up --build``` from the root of the ```server/``` folder

## Run migrations
For the db migrations run,

 ```npx prisma migrate dev --name init --schema ./mount/prisma/schema.prisma```
from the root of the ```server/``` folder.

 **YOU NEED TO RUN FROM THIS FOLDER TO ACCESS THE .env variables**
## Seed DB
to seed the db run, ```npx prisma db seed``` inside of the viral-nation docker terminal. 
Or, you can also try to run from the root of the ```mount/``` folder may recieve an error connecting to localhost:5432

## Prisma Studio
to open prisma studio run ```npx prisma studio  --schema ./mount/prisma/schema.prisma``` from the root of the /server folder. Does not seem to work in Firefox browser! (Safari and Chrome) 

** 
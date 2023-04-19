
## Installation
run ```docker-compose up --build``` from the root of the ```server/``` folder

## Run migrations
For the db migrations run,

 ```npx prisma migrate dev --name init --schema ./mount/prisma/schema.prisma```
from the root of the ```server/``` folder.

 **YOU NEED TO RUN FROM THIS FOLDER TO ACCESS THE .env variables**
## Seed DB
to seed the db run, ```npx prisma db seed``` from the root of the ```mount/``` folder
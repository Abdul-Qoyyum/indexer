## Dependencies
```
node v20.15.0
mysql
npm v10.7.0
```
## Getting Started

Open the terminal on your pc and clone the repository.
```
git clone https://github.com/Abdul-Qoyyum/indexer.git
```

Change directory to the root of the project
```angular2html
cd indexer
```
copy .env.example to .env and set the environmental variables
```angular2html
cp .env.example .env
```
Install dependencies
```angular2html
npm install
```

Run the command for migrations
```angular2html
npm run typeorm:run-migrations (to run database migrations)
```

Start the server
```angular2html
npm run dev
```

Test
```angular2html
npm run test
```

Open http://localhost:3000/api/v1/documentation with your browser to view API documentation.


## Other Commands (for development purposes)
Create migration command
```angular2html
npm run typeorm:create-migration --name=[migrationName]
```
Generate migrations from entities
```angular2html
npm run typeorm:generate-migration
```

Run migration command
```angular2html
npm run typeorm:run-migrations
```

Revert migration command
```angular2html
npm run typeorm:revert-migration
```

Show migration command
```angular2html
npm run typeorm:show-migration
```



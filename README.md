## Using with docker

### Copy .env.example file

```bash
$ cp .env.example .env
```

### Run application

```bash
$ docker compose up --build
```

## Using with watch mode

### Copy .env.example file

```bash
$ cp .env.example .env
```

### Run db

```bash
$ docker compose up mongo --build
```

### Run auth service

```bash
$ npm run start:dev auth
```

### Run tasks service

```bash
$ npm run start:dev tasks
```

## List of api for using

1. /signup POST (port 3001)
2. /signin POST (port 3001)
3. /user GET (port 3001)
4. /tasks POST (port 3002)
5. /tasks GET (port 3002)
6. /tasks DELETE (port 3002)

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

### Run server

```bash
$ npm run start:dev
```

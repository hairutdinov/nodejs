## Build a project
```shell
docker compose build node 
```

## Interactive mode
```shell
docker compose exec -it node sh
```

## npm start
```shell
./npm-start.sh
```

## stop
```shell
./npm-stop.sh
```

## npm start with hot reload 
```shell
docker compose exec node npm run dev
```
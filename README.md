## Build a project
```shell
docker build . -t bulat/alpine-node-npm 
```

## Interactive mode
```shell
docker run --rm -it -p 8101:8101 --name nodealpine -v $(pwd):/usr/src/app bulat/alpine-node-npm sh
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
docker run --rm -p 8101:8101 -v $(pwd):/usr/src/app bulat/alpine-node-npm npm run dev
```
#!/bin/bash
docker run --rm -it -d -p 8101:8080 --name nodeapline -v $(pwd):/usr/src/app bulat/alpine-node-npm npm start
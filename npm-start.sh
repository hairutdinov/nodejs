#!/bin/bash
docker run --rm -it -d -p 8101:8101 --name nodealpine -v $(pwd):/usr/src/app bulat/alpine-node-npm npm start
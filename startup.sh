#!/bin/sh
mongod &
sleep(5)
nodemon src/server/server.js &
( cd src/client ; grunt serve )

#!/bin/bash
docker-compose -f "docker-compose.prod.yml" exec app npm run get-earnings
find /cache -type f -delete

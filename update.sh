#!/bin/bash
docker compose exec app npm run get-earnings
find /cache -type f -delete

#!/bin/bash
docker compose exec app yarn run get-earnings
find /cache -type f -delete

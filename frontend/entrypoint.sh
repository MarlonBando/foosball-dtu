#!/bin/sh

# Replace ${BACKEND_URL} in the template with runtime environment variable
envsubst '$BACKEND_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Start Nginx as the main process
exec nginx -g 'daemon off;'

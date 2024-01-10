# Main
FROM node:16.15.1-alpine


WORKDIR /app
COPY ./dist ./dist
COPY ./server ./server
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json
EXPOSE 4000
CMD ["node","dist/server"]

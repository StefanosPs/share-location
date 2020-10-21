# share-location-orchestration-hexagonal-node:

> The orchestrator of share location app.

**This is work in progress**
 

## Development

```bash
# start in development mode using nodemon
yarn dev

# run before tests
cd ../user
yarn teste2e:runserver | pino-pretty -c -t

# run all tests
yarn test
## run unit tests
yarn test:unit
## run e2e tests
yarn teste2e:open


# start in debug mode
yarn debug

# run linters (eslint + prettier)
yarn lint

# drive through cli
yarn cmd

# create production build
yarn build

# start production build
yarn start
```
## Docker
```bash
# builds an image from a Dockerfile
docker build -t share_loc_orchestrator_image .

docker run -it --name share_loc_orchestrator_name -p 3001:3001 share_loc_orchestrator_image

##Connect to docker
docker exec -it share_loc_orchestrator_name /bin/sh
docker exec -it share_loc_orchestrator_name pm2 monit
docker exec -it share_loc_orchestrator_name pm2 list
docker exec -it share_loc_orchestrator_name pm2 show
docker exec -it share_loc_orchestrator_name pm2 reload all
```
## Docs

```sh
# Generate JS docs
$ yarn jsdoc

# Generate API docs
$ yarn apidoc
```

## CLI
 yarn cmd user create -u test -p t3$T1101
 yarn cmd user get

## Folder structure
- Domain
  - src/domain
- Infrastructure
  - src/broker
  - src/data 
- User Interface
  - src/cli
  - src/http-server
- Tests Directory
  - src/__tests__
  - cypress/integration
- Modules
  - i18n
  - authentication
- Static files
  - files
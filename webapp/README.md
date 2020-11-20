# share-location-single-page-application:

> The SPA of the application.


**This is work in progress**

## Available Scripts
```bash
#Runs the app in the development mode
yarn start

#Launches the test runner in the interactive watch mode.
yarn test

#Builds the app for production to the `build` folder
yarn build
```

## Docker
```bash
docker build -t share_loc_spa_image .

docker run -it --name share_loc_spa_name -p 80:80 share_loc_spa_image
```

### Default Users
- Default User
  - role: Administrator
  - username: admin
  - password: t3$T1101
- NextTest5
  - role: Moderator
  - username: NextTest5
  - password: t3$T1101123
- FullName 1
  - role: User
  - username: FullName 1
  - password: t3$T1101123
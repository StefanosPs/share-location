FROM keymetrics/pm2:12-alpine

# Create the app directory
RUN rm -rf /app
RUN mkdir -p /app
RUN chown -R node:node /app

# The Docker node image includes a non-root user named 'node'.
# A recommended security practice is to avoid running containers as root, and
# to restrict capabilities within the container to only those required by the app.
# Therefore, we use the 'node' user to run the app.
USER node

# Switch to the app directory
WORKDIR /app

# Copy in the NPM dependency files
COPY package.json ./

COPY ecosystem.config.js .
COPY .eslintrc .
COPY .babelrc .
# COPY .env .
COPY sequelize-sqlite.yaml .
COPY users-sequelize.sqlite3 .

# Install app dependencies 
RUN yarn install --ignore-engines  
# RUN yarn install --ignore-engines --production=true

# Copy in the src files
# Ideally we would want to delete src afterwards
# but this cannot be done in Docker and since
# this is a boilerplate
COPY src ./src

# Build and set production
RUN yarn build
ENV NODE_ENV production

# ENV SEQUELIZE_CONNECT sequelize-sqlite.yaml
# ENV HTTP_PORT 3333
# ENV BASIC_AUTH_USERNAME usersrv
# ENV BASIC_AUTH_PASSWORD=basic-auth-password

EXPOSE 3333

# Launch it
CMD ["pm2-runtime",  "start", "ecosystem.config.js"]

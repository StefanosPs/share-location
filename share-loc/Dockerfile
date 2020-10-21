FROM keymetrics/pm2:12-alpine

ENV USER_SERVICE_URL="http://service-usersauth:3333" 

# Create the app directory
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

# Install app dependencies
RUN yarn install --ignore-engines

COPY ecosystem.config.js .
COPY .eslintrc .
COPY .babelrc .
# COPY .env .
COPY sequelize-sqlite.yaml .
COPY users-sequelize.sqlite3 .

# Copy in the src files
# Ideally we would want to delete src afterwards
# but this cannot be done in Docker and since
# this is a boilerplate
COPY src ./src

# Build and set production
RUN yarn build
ENV NODE_ENV production

EXPOSE 3001

# Launch it
CMD ["pm2-runtime",  "start", "ecosystem.config.js"]

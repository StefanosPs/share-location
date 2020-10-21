FROM node:12.19.0-alpine3.10 as build-step
# Create the app directory
RUN mkdir -p /app
# RUN chown -R node:node /app

# USER node

# Switch to the app directory
WORKDIR /app

# Copy in the NPM dependency files
COPY package.json ./

# Install app dependencies
RUN yarn install --ignore-engines

COPY . ./

# Build and set production
RUN yarn build


FROM nginx:1.19.3-alpine

COPY --from=build-step /app/build /usr/share/nginx/html

# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/templates/nginx.conf.template /etc/nginx/templates/nginx.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
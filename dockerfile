# Use the official Node.js version 14 image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install git and other necessary system utilities
RUN apt-get update && apt-get install -y git

# Clone the repository containing the application code
RUN git clone https://github.com/Noamika8/weatherapp.git .

# Explicitly install each npm package
RUN npm install --save @opentelemetry/api \
    @opentelemetry/instrumentation \
    @opentelemetry/tracing \
    @opentelemetry/exporter-trace-otlp-http \
    @opentelemetry/resources \
    @opentelemetry/semantic-conventions \
    @opentelemetry/auto-instrumentations-node \
    @opentelemetry/sdk-node

RUN npm install --save express@^4.17.1 node-fetch@^3.0.0
# Copy your tracer and server files into the working directory
COPY ./tracer.cjs ./
COPY ./server.cjs ./

# Expose port 3000 to allow external access to the application
EXPOSE 3000

# Define the command to start the Node.js application
CMD ["node", "server.cjs"]

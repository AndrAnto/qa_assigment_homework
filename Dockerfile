FROM cypress/included:15.20.1

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

ENTRYPOINT ["npx", "cypress", "run"]

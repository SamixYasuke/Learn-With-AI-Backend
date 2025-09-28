# Use an official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock. If you use npm, change yarn.lock to package-lock.json.
COPY package.json yarn.lock ./

# Install dependencies using Yarn
# If you are using npm, change this to 'RUN npm install'
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the app using Yarn
# If you are using npm, change this to CMD ["npm", "run", "dev"]
CMD ["yarn", "dev"]

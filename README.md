# Overview

This example demonstrates a frontend interface and backend API. The frontend uses:

- ES6
- React

The backend uses:

- Node.js
- Express
- MongoDB

Both run independently, so they are easy to review.

## Backend Startup

First get MongoDB running. Then modify and rename `auth.example.js`. Then:

	npm install
	npm start

Then, in a second terminal run the simple test cases:

	npm test

## Frontend Startup

	npm install
	npm start

## Notes

This code was extracted from an experimental version of TF Language and cleaned up to be easier to follow. Most of the functionality was stripped. A few things were replaced with small placeholders.

In production, the frontend and backend can be served through an Nginx instance.

The full software uses Redis as a cache for user session data. This allows horizontal scalability by simple launching more instances.

The front-end uses some React components, but isn't fully React. Also, the front-end is a little rough since I had to remove a lot of code to make it work without a backend.

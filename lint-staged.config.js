export default {
  "*.js": ["npm run lint:js --", "npm run format --"],
  "*.css": "npm run lint:css --",
  "*.*": ["npm run lint:ls --", "npm run format --"],
};

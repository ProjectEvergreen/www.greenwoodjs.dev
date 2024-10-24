export default {
  "*.js": ["npm run lint:js --"],
  "*.css": "npm run lint:css --",
  "*.*": ["npm run lint:ls --", "npm run format --"],
};

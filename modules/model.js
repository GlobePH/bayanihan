const bayes = require('bayes');
const classifier = bayes();
const trainingData = require('../training');
const categories = ['critical', 'major', 'minor'];

categories.forEach((category) => {
  const messages = trainingData[category].messages;
  // const coords = trainingData[category].coords;

  for(let i = 0; i < messages.length; ++i) {
    classifier.learn(messages[i], category);
  }
});

module.exports = {
  classifier,
  categories
};

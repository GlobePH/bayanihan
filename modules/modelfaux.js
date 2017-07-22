/**
 * model.sj
 */
const trainingData = require('../training');
const categories = ['critical', 'major', 'minor'];
let tokens = [];
let allWords = [];
let wordCategories = {};


categories.forEach((category) => {
  const messages = trainingData[category].messages;

  wordCategories[category] = [];
  messages.forEach((msg) => {
    //- tokenize words
    const words = msg.toLowerCase()
      .replace(/[^a-z0-9 ]/gm, '')
      .split(' ')
      .filter(w => w.length > 0);

    //- track all words for feature distribution
    allWords = allWords.concat(words);

    //- track words by category
    wordCategories[category] = wordCategories[category].concat(words);
  });
});

const model = {};
categories.forEach((category) => {
  model[category] = extractFeatures(wordCategories[category]);
});

function extractFeatures(words) {
  let features = {};
  for(let i = 0; i < words.length; ++i) {
    const word = words[i];
    if(features[word]) {
      features[word] += 1;
    } else {
      features[word] = 1;
    }
  }
  return features;
}


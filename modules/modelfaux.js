/**
 * model.sj
 */
const trainingData = require('../training');
const categories = ['critical', 'major', 'minor'];
let allWords = [];
let set = new Set();
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

    //- track all unique words
    words.forEach(w => { set.add(w); });

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

function classify(message) {
  let score = {};

  const words = extractFeatures(message.toLowerCase()
    .replace(/[^a-z0-9 ]/gm, '')
    .split(' ')
    .filter(w => w.length > 0));

  categories.forEach(function(category) {
    const classCount = Object.keys(model[category]).length; // count(c)
    const vocabularyCount = set.size; // |V|
    score[category] = {};
    score[category].value = 1;

    const features = model[category];
    for(let property in features) {
      if(features.hasOwnProperty(property)) {
        let featFreqPerClass = 0;
        if(words[property]) { featFreqPerClass = features[property]; }
        score[category].value *= (featFreqPerClass + 1) / (classCount + vocabularyCount + 1);
      }
    }
  });
  // find the max score among the classes
  let max = 0;
  let selectedClass = null;
  for(let property in score) {
    if(score.hasOwnProperty(property)) {
      if(score[property].value > max) {
        selectedClass = property;
        max = score[property].value;
      }
    }
  }
  return selectedClass;
}

const bayes = require('bayes');
const classifier = bayes();

categories.forEach((category) => {
  const messages = trainingData[category].messages;
  // const coords = trainingData[category].coords;

  for(let i = 0; i < messages.length; ++i) {
    classifier.learn(messages[i], category);
  }
});

const msgs = [
  // 'hello po',
  // 'kamusta kayo diyan ito bago kong roaming number',
  'good morning sa inyo diyan',
  // 'ano gawa mo bes?',
  // 'kritical lagay ngayon ni tito, punta ka dali',
  'bumagsak yung bldg dito sa 32nd st. nid rescue asap',
  // 'sulit sa kain dito pre',
  // 'lintik lang ang walang ganti',
  // 'oi gago ka, magpakita ka sa akin'
];
msgs.forEach(msg => {
  const res = classify(msg);
  const ccc = classifier.categorize(msg);
  console.log(msg, res, ccc);
});

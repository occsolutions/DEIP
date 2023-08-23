
import * as stringSimilarity from 'string-similarity';
import { IOpenAnswers } from '../contracts/open-answers';

export default async (
  openAnswers: IOpenAnswers
) => {

  const mode = (arr) => {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length
      - arr.filter(v => v === b).length
    ).pop();
  };

  const similarityGroup = (source, rate = 0.8) => {
    let _source, matches, x, y;
    _source = source.slice();
    matches = [];
    for (x = _source.length - 1; x >= 0; x--) {
      const output = _source.splice(x, 1);

      for (y = _source.length - 1; y >= 0; y--) {
        const match = stringSimilarity.compareTwoStrings(output[0], _source[y]);
        if (match > rate) {
          output.push(_source[y]);
          _source.splice(y, 1);
          x--;
        }
      }
      matches.push(output);
    }
    return matches;
  };

  // Group cleaned words by question
  const questionWords: any = {};
  for (const key of Object.keys(openAnswers)) {
    const qWords = openAnswers[key].answers;
    const cleanWords = [];
    qWords.forEach(word => {
      if (word) {
        const tmp = word
          .toUpperCase()
          // Normalize each word to remove diacritics except "Ñ"
          .normalize('NFD')
          .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, '$1')
          .replace(/[^A-ZÑ\s]/gi, '');
        if (tmp && tmp.length >= 3) {
          cleanWords.push(tmp);
        }
      }
    });
    questionWords[key] = cleanWords;
  }

  // Group similar words an each question, Count similarities & find most repeated word of each group
  const indexedWords = {};
  Object.keys(questionWords).forEach(key => {
    const grouped = similarityGroup(questionWords[key]);
    const sorted  = grouped.sort((a, b) => b.length - a.length).slice(0, 40);
    const countedWords = [];
    for (const group of sorted) {
      const cloneGroup = JSON.parse(JSON.stringify(group));
      countedWords.push({
        count: group.length,
        word: group.length > 1 ? mode(cloneGroup) : group[0],
        allWords: group
      });
    }
    questionWords[key] = countedWords;

    const top = countedWords[0].count;
    indexedWords[key] = countedWords.map(w => ({
      name: w.word,
      weighing: (w.count / top) * 100,
      value: w.count
    }));
  });

  return {
    grouped: questionWords,
    weighted: indexedWords
  };
};

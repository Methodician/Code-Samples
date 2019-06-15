//A common helper method done right...
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const createRandomIndexMap = length => {
  const ascendingArray = [];
  for (let i = 0; i < length; i++) {
    ascendingArray.push(i);
  }
  return shuffleArray(ascendingArray);
};

export default createRandomIndexMap;

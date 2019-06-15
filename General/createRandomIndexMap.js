// Here are a couple common helper methods done right...
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

// export default createRandomIndexMap;

// HOW TO USE:
// Simply import the default with whatever name you like.
// Then call it in a function that handles the the onTouchEnd event
const preventLongpressContextMenu = () => {
  window.oncontextmenu = e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  setTimeout(() => {
    window.oncontextmenu = () => {
      return true;
    };
  }, 100);
};

// export default preventLongpressContextMenu;

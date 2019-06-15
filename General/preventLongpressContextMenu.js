// A common helper method done right
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

export default preventLongpressContextMenu;

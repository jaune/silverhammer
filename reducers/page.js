var initialState = {
  title: '<title>'
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  return state;
}
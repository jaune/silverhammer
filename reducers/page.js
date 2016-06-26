const initialState = {
  title: '<title>'
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState); // Clone initialState !!!
  }

  return state;
}
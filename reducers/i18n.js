var initialState = {
  language: 'fr-FR', // https://www.w3.org/International/articles/language-tags/
  dir: 'ltr'
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  return state;
}
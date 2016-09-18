const React = require('react');
const ReactRedux = require('react-redux');
const Fetcher = require('../lib/fetcher');

function mapStateToProps (state, ownProps) {
  return {
    passports: Object.keys(state.collections.passport).map(function (key) {
      return state.collections.passport[key];
    })
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

module.exports = React.createClass({
  displayName: 'Passports',

  render: function() {
    var passports = this.props.passports.map(function (passport, index) {
      return (<li key={index}><a href={passport.url}>{passport.url}</a></li>);
    });

    return (
      <ul>
        {passports}
      </ul>
    );
  }
});

module.exports = Fetcher.connect([ 'collections.passport.*' ])(module.exports);

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(module.exports);

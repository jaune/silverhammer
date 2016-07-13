const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  return {
    passports: Object.keys(state.constants.passports).map(function (key) {
      return state.constants.passports[key];
    })
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

const Passports = React.createClass({
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

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Passports);
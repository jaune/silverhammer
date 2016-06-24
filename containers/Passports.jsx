const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  return {
    passports: state.authorize.passports
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
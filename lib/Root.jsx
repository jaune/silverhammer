const React = require('react');
const ReduxProvider = require('react-redux').Provider;
const RouterProvider = require('./router/components/Provider.jsx');

module.exports = React.createClass({
  displayName: 'Root',
  propTypes: {
    store: React.PropTypes.object,
    router: React.PropTypes.object
  },
  render: function() {
    return (
      <ReduxProvider store={this.props.store}>
        <RouterProvider router={this.props.router}>
            {this.props.children}
        </RouterProvider>
      </ReduxProvider>
    );
  }
});
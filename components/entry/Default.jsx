const React = require('react');
const ReduxProvider = require('react-redux').Provider;
const RouterProvider = require('../../lib/router/components/Provider.jsx');
const FetcherProvider = require('../../lib/fetcher/components/Provider.jsx');

const Layout = require('../layout/Default.jsx');

module.exports = React.createClass({
  displayName: 'entry/Default',
  propTypes: {
    store: React.PropTypes.object,
    router: React.PropTypes.object,
    fetcher: React.PropTypes.object
  },
  render: function() {
    return (
      <ReduxProvider store={this.props.store}>
        <RouterProvider router={this.props.router}>
          <FetcherProvider fetcher={this.props.fetcher}>
            <Layout />
          </FetcherProvider>
        </RouterProvider>
      </ReduxProvider>
    );
  }
});
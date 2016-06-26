const React = require('react');

const LogOutButton = require('../containers/LogOutButton.jsx');

const Page = React.createClass({
  render: function() {
    return (
      <div className="page--authorize">
        <header role="banner" style={{background: '#eee', margin: '0.5em'}}>
          <pre>[header]</pre>
          <LogOutButton />
          <pre>[/header]</pre>
        </header>
        <nav role="navigation" style={{background: '#eee', margin: '0.5em'}}>
          <pre>[nav]</pre>
          <pre>[/nav]</pre>
        </nav>
        <main role="main" style={{background: '#eee', margin: '0.5em'}}>
          <pre>[main]</pre>
          {this.props.children}
          <pre>[/main]</pre>
        </main>
        <footer role="contentinfo" style={{background: '#eee', margin: '0.5em'}}>
          <pre>[footer]</pre>
          <pre>[/footer]</pre>
        </footer>
      </div>
    );
  }
});

module.exports = Page;
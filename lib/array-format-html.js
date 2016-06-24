function formatHTML(node, indent) {
  indent = indent || 0;

  var html = '';

  node.forEach(function (child) {
    var i;

    if (Array.isArray(child)) {
      html += formatHTML(child, indent + 1);
    } else {
      html += '\n';

      for (i = 0; i < indent; i++) {
        html += ' ';
      }

      html += child;
    }
  });

  return html;
}

module.exports = formatHTML;
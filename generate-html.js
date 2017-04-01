var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var apiData = JSON.parse(fs.readFileSync(path.join(__dirname, 'doc', 'api_data.json'), 'utf8'));
var Promise = require('bluebird');
var writeFile = Promise.promisify(require('fs').writeFile);

var sections = function() {
  var unique = [];
  apiData.forEach(function(data) {
    if (unique.indexOf(data.group) === -1) { unique.push(data.group); }
  });
  return unique;
};

var subSections = function() {
  var menu = {};
  var secs = sections();
  secs.forEach(function(section) {
    menu[section] = [];
  });
  apiData.forEach(function(data) {
    menu[data.group].push({
      name: data.title,
      anchor: data.name.toLowerCase()
    });
  });
  return menu;
};


function generate() {
  return writeFile(
    'nav-output.html',
    ejs.render(
      fs.readFileSync('nav-template.html', 'utf8'),
      { sections: sections(), subSections: subSections() }
    )
  )
  .then(function() {
    return writeFile(
        'content-output.html',
        ejs.render(
          fs.readFileSync('content-template.html', 'utf8'),
          { apiData: apiData }
        )
      );
  })
  .then(function() {
    return {
      nav: path.join(__dirname, 'nav-output.html'),
      content: path.join(__dirname, 'content-output.html')
    };
  });
}

module.exports = {
  generate: generate
};

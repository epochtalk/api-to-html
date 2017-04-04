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
    'nav-output.ejs',
    ejs.render(
      fs.readFileSync('nav-template.ejs', 'utf8'),
      { sections: sections(), subSections: subSections() }
    )
  )
  .then(function() {
    return writeFile(
        'content-output.ejs',
        ejs.render(
          fs.readFileSync('content-template.ejs', 'utf8'),
          { apiData: apiData }
        )
      );
  })
  .then(function() {
    return ejs.renderFile(__dirname + '/api-template.ejs', 'utf8', function(err, data) {
      if (err) { return err; }
      return writeFile('api.html', data);
    });
  })
  .then(function() {
    return {
      output: path.join(__dirname, 'api.html')
    };
  });
}

module.exports = {
  generate: generate
};

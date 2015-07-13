var fs = require('fs');
var ejs = require('ejs');
var apiData = JSON.parse(fs.readFileSync('api_data.json', 'utf8'));

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

fs.writeFile('nav-output.html',
  ejs.render(
    fs.readFileSync('nav-template.html', 'utf8'),
    {
      sections: sections(),
      subSections: subSections()
    }
  ),
  function(err) {
    if(err) { return console.log(err); }
    console.log('done');
  }
);

fs.writeFile('content-output.html',
  ejs.render(
    fs.readFileSync('content-template.html', 'utf8'),
    {
      apiData: apiData
    }
  ),
  function(err) {
    if(err) { return console.log(err); }
    console.log('done');
  }
);

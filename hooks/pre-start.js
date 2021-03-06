var fs = require('fs-extra');
var jsonConcat = require("json-concat");
var fsCore = require('fs');
var path = require('path');

function getDirectoryFiles(dir) {
  return fsCore.readdirSync(dir).reduce(function(list, file) {
    var name = path.join(dir, file);
    var isDir = fsCore.statSync(name).isDirectory();
    return list.concat(isDir ? getDirectoryFiles(name) : [name]);
  }, []);
}

function mergeAndSaveJsonFiles(src, dest) {
  jsonConcat({ src: src, dest: dest },
    function (res) {
      console.log('Localization files successfully merged!');
    }
  );
}

function setEnvironment(configPath, environment) {
  fs.writeJson(configPath, {env: environment},
    function (res) {
      console.log('Environment variable set to ' + environment)
    }
  );
}

// Set environment variable to "development"
setEnvironment('./config/env.json', 'development');

// Get all localization files list in array
var localizationSourceFilesEN = getDirectoryFiles('./i18n/en');
var localizationSourceFilesHR = getDirectoryFiles('./i18n/hr');

// Merge all localization files into one
mergeAndSaveJsonFiles(localizationSourceFilesEN, "./i18n/en.json");
mergeAndSaveJsonFiles(localizationSourceFilesHR, "./i18n/hr.json");
const { isString, isSelector, isElement } = require('../helper');
const FileFieldWrapper = require('../elementWrapper/fileFieldWrapper');
const path = require('path');
const fs = require('fs');
const { description, waitAndGetActionableElement } = require('./pageActionChecks');
const { defaultConfig } = require('../config');
const domHandler = require('../handlers/domHandler');
const { highlightElement } = require('../elements/elementHelper');

const attach = async (filepath, to, options) => {
  let resolvedPath = filepath ? path.resolve(process.cwd(), filepath) : path.resolve(process.cwd());
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File ${resolvedPath} does not exist.`);
  }
  if (isString(to)) {
    to = new FileFieldWrapper(to);
  } else if (!isSelector(to) && !isElement(to)) {
    throw Error('Invalid element passed as parameter');
  }
  const element = await waitAndGetActionableElement(to, options.force);
  if (defaultConfig.headful) {
    await highlightElement(element);
  }
  await domHandler.setFileInputFiles(element.get(), resolvedPath);
  return 'Attached ' + resolvedPath + ' to the ' + description(to, true);
};

module.exports = { attach };

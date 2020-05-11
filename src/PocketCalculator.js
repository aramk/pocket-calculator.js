const _ = require('underscore');

const template = require('./template.html');

class PocketCalculator {

  constructor({element}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Invalid element');
    }
    this.element = element;
  }

  render() {
    debugger
    this.element.innerHTML = _.template(template)();
  }

}

module.exports = PocketCalculator;

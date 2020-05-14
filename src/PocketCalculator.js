const _ = require('underscore');

const template = require('./template.html');

const RE_NUMBER = /^\d+$/;
const MODES = new Set(['/', '*', '-', '+']);
const ACTIVE_MODE_CLASS = 'pocket-calculator-active-mode';
const DEFAULT_VALUE = '0';

class PocketCalculator {

  constructor({element}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Invalid element');
    }
    this.element = element;
    this.mode = null;
    this.expr = '';
  }

  render() {
    this.element.innerHTML = _.template(template)();
    const input = this.element.querySelector('.pocket-calculator-input');
    input.value = '0';
    input.addEventListener('keydown', event => {
      event.preventDefault();
    });
    this.element.addEventListener('click', event => {
      if (event.target.nodeName !== 'BUTTON') {
        return;
      }
      const {name} = event.target;
      if (RE_NUMBER.test(name)) {
        if (input.value === DEFAULT_VALUE || this.mode) {
          input.value = name;
        } else {
          input.value += name;
        }
      } else if (name === 'sign') {
        if (input.value !== DEFAULT_VALUE) {
          const newValue = input.value.replace(/^-/, '');
          if (input.value === newValue) {
            input.value = `-${newValue}`;
          }
        }
      } else if (name === 'period') {
        input.value += '.';
      } else if (MODES.has(name)) {
        this._setMode(name);
        this.expr += `${input.value}${name}`;
      } else if (name === 'c') {
        input.value = this.expr = DEFAULT_VALUE;
        this._setMode(null);
      } else if (name === 'percentage') {
        
      } else if (name === 'equal') {
        if (this.mode != null) {
          this.expr += `${input.value}`;
          this._setMode(null);
          input.value = this.expr = this._calcExpr(this.expr);
        }
      }
    });
  }

  _setMode(name) {
    this.mode = name;
    for (const mode of MODES) {
      const {classList} = this.element.querySelector(`button[name="${mode}"]`);
      if (mode === name) {
        classList.add(ACTIVE_MODE_CLASS);
      } else {
        classList.remove(ACTIVE_MODE_CLASS);
      }
    }
  }

  _calcExpr(expr) {
    return (new Function(`return (${expr}).toString()`))();
  }

}

module.exports = PocketCalculator;

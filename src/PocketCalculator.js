const _ = require('underscore');

const template = require('./template.html');

const RE_NUMBER = /^\d+$/;
const RE_NEGATIVE = /^-/;
const MODES = new Set(['/', '*', '-', '+']);
const ACTIVE_MODE_CLASS = 'pocket-calculator-active-mode';
const DEFAULT_VALUE = '0';
const INVALID_KEYS = ['e'];

class PocketCalculator {

  constructor({element, input = null}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Invalid element');
    }
    this.element = element;
    this.input = input;
    this.mode = null;
    this.lastCharWasMode = false;
    this.expr = '';
    this.calculated = false;
    this.period = false;
  }

  render() {
    const {element} = this;
    element.innerHTML = _.template(template)();
    const templateInput = element.querySelector('.pocket-calculator-input')
    if (this.input == null) {
      this.input = templateInput;
    } else {
      templateInput.style.display = 'none';
    }
    const input = this.input;
    if (!input.value) {
      input.value = '0';
    }
    input.addEventListener('keydown', event => {
      const {key} = event;
      if (RE_NUMBER.test(key) && (input.value === DEFAULT_VALUE || this.mode)) {
        this._addNumber(key);
        event.preventDefault();
      } else if (INVALID_KEYS.includes(key)) {
        event.preventDefault();
      } else if (MODES.has(key)) {
        this._enterMode(key);
        event.preventDefault();
      } else if (key === 'Enter') {
        this._calc();
        event.preventDefault();
      }
    });
    element.addEventListener('click', event => {
      if (event.target.nodeName !== 'BUTTON') {
        return;
      }
      const {name} = event.target;
      if (RE_NUMBER.test(name)) {
        this._addNumber(name);
      } else if (name === 'sign') {
        if (input.value !== DEFAULT_VALUE) {
          const newValue = input.value.replace(RE_NEGATIVE, '');
          input.value = (input.value === newValue ? '-' : '') + newValue;
          this._triggerChange();
        }
      } else if (name === 'period') {
        this.period = true;
      } else if (MODES.has(name)) {
        this._enterMode(name);
      } else if (name === 'c') {
        input.value = DEFAULT_VALUE;
        this.expr = '';
        this._setMode(null);
        this._triggerChange();
      } else if (name === 'percentage') {
        input.value = this._calcExpr(input.value + '/100').toString();
        this._triggerChange();
      } else if (name === 'equal') {
        this._calc();
      }
    });
  }

  _addNumber(number) {
    const {input} = this;
    let newValue = number;
    if (this.period) {
      newValue = '.' + newValue;
      this.period = false;
    }
    if (input.value === DEFAULT_VALUE || this.lastCharWasMode || this.calculated) {
      input.value = newValue;
      this.calculated = false;
    } else {
      input.value += newValue;
    }
    this.lastCharWasMode = false;
  }

  _enterMode(mode) {
    if (this.mode != null) {
      this._calc();
    }
    this._setMode(mode);
    this._addExpr(this.input.value);
    this.expr += mode;
  }

  _setMode(mode) {
    this.mode = mode;
    this.lastCharWasMode = mode != null;
    for (const otherMode of MODES) {
      const {classList} = this.element.querySelector(`button[name="${otherMode}"]`);
      if (otherMode === mode) {
        classList.add(ACTIVE_MODE_CLASS);
      } else {
        classList.remove(ACTIVE_MODE_CLASS);
      }
    }
  }

  _addExpr(inputValue) {
    const value = RE_NEGATIVE.test(inputValue) ? `(${inputValue})` : inputValue;
    this.expr += value;
  }

  _calc() {
    if (this.mode != null) {
      const oldExpr = this.expr;
      try {
        this._addExpr(this.input.value);
        let newValue = this._calcExpr(this.expr);
        if (newValue === Infinity) {
          newValue = 0;
        }
        this.input.value = newValue.toString();
        this._setMode(null);
        this.expr = '';
        this._triggerChange();
      } catch (err) {
        console.error(err);
        alert('An error occurred!');
        this.expr = oldExpr;
      }
      this.calculated = true;
    }
  }

  _calcExpr(expr) {
    return (new Function(`return (${expr})`))();
  }

  _triggerChange() {
    this.input.dispatchEvent(new Event('change'));
  }

}

module.exports = PocketCalculator;

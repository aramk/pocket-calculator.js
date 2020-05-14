const {PocketCalculator} = require('../src/index');

ready(() => {
  const calculator = new PocketCalculator({
    element: document.getElementById('calculator'),
  });
  
  calculator.render();  
});

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

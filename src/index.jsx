// @flow

import React from 'react';
import ReactDOM from 'react-dom';

const title = 'My Minimal React Webpack Babel Setup';

const element: ?Element = document.getElementById('app');

declare var module : {
  hot: {
    accept(): void;
  };
};

if (element) {
  ReactDOM.render(
    <div>{title}</div>,
    element,
  );
} else {
  console.log('Fatal error trying to render a page');
}

module.hot.accept();

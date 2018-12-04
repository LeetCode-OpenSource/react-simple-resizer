import React from 'react';
import ReactDOM from 'react-dom';

import {
  Simple,
  DefaultSize,
  ResponsiveSize,
  MaxMinSize,
  FixedSize,
  NestingDemo,
} from './sections';

ReactDOM.render(
  <React.Fragment>
    <Simple />
    <DefaultSize />
    <ResponsiveSize />
    <MaxMinSize />
    <FixedSize />
    <NestingDemo />
  </React.Fragment>,
  document.getElementById('app'),
);

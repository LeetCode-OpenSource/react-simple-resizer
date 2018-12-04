import React from 'react';
import ReactDOM from 'react-dom';

import {
  Simple,
  DefaultSize,
  ResponsiveSize,
  MaxMinSize,
  FixedSize,
  NestingDemo,
  CollapsibleSection,
  InteractiveSection,
} from './sections';

ReactDOM.render(
  <React.Fragment>
    <Simple />
    <DefaultSize />
    <ResponsiveSize />
    <MaxMinSize />
    <FixedSize />
    <NestingDemo />
    <h1>Custom Behavior</h1>
    <CollapsibleSection />
    <InteractiveSection />
  </React.Fragment>,
  document.getElementById('app'),
);

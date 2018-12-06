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
  <main>
    <h1>Default Behavior</h1>
    <Simple />
    <DefaultSize />
    <ResponsiveSize />
    <MaxMinSize />
    <FixedSize />
    <NestingDemo />
    <h1>Custom Behavior</h1>
    <CollapsibleSection />
    <InteractiveSection />
  </main>,
  document.getElementById('app'),
);

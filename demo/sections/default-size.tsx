import React from 'react';

import { Resizer } from '../../src';

export const DefaultSize = () => (
  <div>
    <h2>default size demo</h2>
    <Resizer.Container className="container">
      <Resizer.Section className="section" defaultSize={400}>
        default is 400px.
      </Resizer.Section>
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section"/>
    </Resizer.Container>
  </div>
);

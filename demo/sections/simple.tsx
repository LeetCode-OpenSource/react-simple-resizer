import React from 'react';

import * as Resizer from '../../src';

export const Simple = () => (
  <section>
    <h2>Simple demo</h2>
    <Resizer.Container className="container">
      <Resizer.Section className="section" minSize={100} />
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" minSize={100} />
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" minSize={100} />
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" minSize={100} />
    </Resizer.Container>
  </section>
);

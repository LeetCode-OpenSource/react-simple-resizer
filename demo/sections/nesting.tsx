import React from 'react';

import * as Resizer from '../../src';

export const NestingDemo = () => (
  <section>
    <h2>Nesting demo</h2>
    <Resizer.Container className="container">
      <Resizer.Section className="section">
        <Resizer.Container vertical className="container">
          <Resizer.Section className="section" />
          <Resizer.Bar size={10} className="bar" />
          <Resizer.Section className="section" />
        </Resizer.Container>
      </Resizer.Section>
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section">
        <Resizer.Container className="container">
          <Resizer.Section className="section" />
          <Resizer.Bar size={10} className="bar" />
          <Resizer.Section className="section" />
        </Resizer.Container>
      </Resizer.Section>
    </Resizer.Container>
  </section>
);

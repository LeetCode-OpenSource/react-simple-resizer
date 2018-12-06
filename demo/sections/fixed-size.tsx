import React from 'react';

import * as Resizer from '../../src';

export const FixedSize = () => (
  <section>
    <h2>Fixed size demo</h2>
    <Resizer.Container className="container">
      <Resizer.Section className="section" size={500}>
        Fixed size.
        <br />
        (default is not responsive)
      </Resizer.Section>
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" />
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" maxSize={500} defaultSize={200}>
        max size is 500px.
      </Resizer.Section>
    </Resizer.Container>

    <h2>Responsive fixed size demo</h2>
    <Resizer.Container className="container">
      <Resizer.Section className="section" size={500} disableResponsive={false}>
        Fixed size.
        <br />
        (try to resize the browser to see the difference)
      </Resizer.Section>
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" />
      <Resizer.Bar size={10} className="bar" />
      <Resizer.Section className="section" maxSize={500} defaultSize={200}>
        max size is 500px.
      </Resizer.Section>
    </Resizer.Container>
  </section>
);

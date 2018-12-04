import React from 'react';

import { Container, Section, Bar, Resizer } from '../../src';

function onResizing(resizer: Resizer): void {
  if (resizer.getSectionSize(0) < 150) {
    resizer.resizeSection(0, { toSize: 0 });
  } else if (resizer.getSectionSize(0) < 300) {
    resizer.resizeSection(0, { toSize: 300 });
  }
}

export const CollapsibleSection = () => (
  <div>
    <h2>Collapsible section demo</h2>
    <Container className="container" onResizing={onResizing}>
      <Section className="section" />
      <Bar size={10} className="bar" />
      <Section className="section" />
    </Container>
  </div>
);

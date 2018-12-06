import React from 'react';

import { Container, Section, Bar, Resizer } from '../../src';

function onResizing(resizer: Resizer): void {
  if (resizer.isBarActivated(0)) {
    resizer.resizeSection(2, { toSize: resizer.getSectionSize(0) });
  } else {
    resizer.resizeSection(0, { toSize: resizer.getSectionSize(2) });
  }

  if (resizer.getSectionSize(1) < 300) {
    const remainingSize = resizer.getTotalSize() - 300;
    resizer.resizeSection(0, { toSize: remainingSize / 2 });
    resizer.resizeSection(1, { toSize: 300 });
    resizer.resizeSection(2, { toSize: remainingSize / 2 });
  }
}

export const InteractiveSection = () => (
  <section>
    <h2>Interactive section demo</h2>
    <Container className="container" beforeApplyResizer={onResizing}>
      <Section className="section" />
      <Bar size={10} className="bar" />
      <Section className="section" />
      <Bar size={10} className="bar" />
      <Section className="section" />
    </Container>
  </section>
);

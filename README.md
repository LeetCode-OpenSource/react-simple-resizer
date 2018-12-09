# react-simple-resizer &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LeetCode-OpenSource/react-simple-resizer/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier) [![npm version](https://img.shields.io/npm/v/react-simple-resizer.svg?style=flat)](https://www.npmjs.com/package/react-simple-resizer)


An intuitive React component set for multi-column(row) resizing. You could [customize the behavior of resizing](#customize-resize-behavior) in a very simple way. Works in every modern browser [which](https://caniuse.com/#feat=flexbox) supports [flexible box layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout).

#### Table of Contents
- [Installation](#installation)
- [Examples](#examples)
- [Components](#components)
    - [Container](#container-)
    - [Section](#section-)
    - [Bar](#bar-)
- [Customize resize behavior](#customize-resize-behavior)
- [Contributing](#contributing)

## Installation
Using [yarn](https://yarnpkg.com/):
```bash
yarn add react-simple-resizer
```

Or via [npm](https://docs.npmjs.com):
```bash
npm install react-simple-resizer
```

## Examples

Here is a minimal example for two-column layout:
```jsx
import React from 'react';
import { Container, Section, Bar } from 'react-simple-resizer';

export default () => (
  <Container style={{ height: '500px' }}>
    <Section style={{ background: '#d3d3d3' }} minSize={100}/>
    <Bar size={10} style={{ background: '#888888', cursor: 'col-resize' }} />
    <Section style={{ background: '#d3d3d3' }} minSize={100} />
  </Container>
);
```

We have created several demos on CodeSandbox, check demos below:

- [Simple demo](https://codesandbox.io/s/qkw1rxxq29)
- [Make Section collapsible](https://codesandbox.io/s/1vpy7kz5j3)
- [Multiple Section linkage effects](https://codesandbox.io/s/r51pv3qzpm)

## Components

### \<Container \/\>

Literally, it's the container of the other components.

```typescript
import { Container } from 'react-simple-resizer';
```

#### Props
```typescript
import { HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  onActivate?: () => void;
  beforeApplyResizer?: (resizer: Resizer) => void;
  afterResizing?: () => void;
}
```

##### `vertical`

Determine whether using vertical layout or not, default is `false`.

##### `onActivate`

Triggered when any [`Bar`](#bar-) is activated. i.e, [onMouseDown](https://developer.mozilla.org/en/docs/Web/Events/mousedown) or [onTouchStart](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart).

##### `beforeApplyResizer`

Used to [customize resize behavior](#customize-resize-behavior). In this method, you __don't__ need to call [`applyResizer`](#applyresizer) to apply the resize result. Please note that you should not do any side effect on this method. If you want to do something after resizing, see [`afterResizing`](#afterresizing) below.

##### `afterResizing`

Triggered after a <a name="resizing-section">__resizing section__</a> is completed, which means that it will be triggered after [onMouseUp](https://developer.mozilla.org/en-US/docs/Web/Events/mouseup) and [onTouchEnd](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) events. If you want to do something after size of section has changed, use [`onSizeChanged`](#onsizechanged) props on the [`Section`](#section-) instead.

#### Instance properties
```typescript
import React from 'react';

class Container extends React.PureComponent<ContainerProps> {
    public getResizer(): Resizer
    public applyResizer(resizer: Resizer): void
}
```
##### `getResizer`
Used to get newest [`Resizer`](#customize-resize-behavior). But any change won't apply unless you pass the `Resizer` to `applyResizer`.

##### `applyResizer`
Apply the passed `Resizer` to `Container`.

---
### \<Section \/\>

```typescript
import { Section } from 'react-simple-resizer';
```

#### Props
```typescript
import { HTMLAttributes, RefObject } from 'react';

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  defaultSize?: number;
  maxSize?: number;
  minSize?: number;
  disableResponsive?: boolean;
  onSizeChanged?: () => void;
  innerRef?: RefObject<HTMLDivElement>;
}
```
##### `size`
Used to set `Section`'s size. If `size` is set, `Section` will ignore the value of `defaultSize`, `maxSize` and `minSize`.

##### `defaultSize`
Used to set default size of `Section`.

##### `maxSize`
Used to set max size of `Section`.

##### `minSize`
Used to set min size of `Section`.

##### `disableResponsive`
Each `Section` is responsive as default, unless `size` exists. The `responsive` here means that `Section`'s size is related with `Container`'s size, if `Container`'s size turn smaller, the `Section`'s size also turn smaller automatically. Otherwise, changes of `Container` size won't affect the `Section` when `disableResponsive` is `true`.

##### `onSizeChanged`
Will be triggered each time its size has changed.

##### `innerRef`
Used to get the actual DOM ref of `Section`.

---
### \<Bar \/\>

```typescript
import { Bar } from 'react-simple-resizer';
```

#### Props
```typescript
import { HTMLAttributes, RefObject } from 'react';

interface ExpandInteractiveArea {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface BarProps extends HTMLAttributes<HTMLDivElement> {
  size: number;
  expandInteractiveArea?: ExpandInteractiveArea;
  onStatusChanged?: (isActive: boolean) => void;
  onClick?: () => void;
  innerRef?: RefObject<HTMLDivElement>;
}
```
##### `size`
Required, used to set the size of `Bar`.

##### `expandInteractiveArea`
Used to expand interactive area of `Bar`.

##### `onStatusChanged`
Triggered when the state of `Bar` has changed.

##### `onClick`
Triggered if there's no "move" events. The main difference between it and original `onClick` event is that __there is no parameters__ on _this_ `onClick`. You could also use it as a touch event on mobile platform, without 300ms click delay.

##### `innerRef`
Used to get the actual DOM ref of `Bar`.

## Customize resize behavior
If you want to customize behavior of resizing, then you have to know how to use `Resizer`.

There is two ways to get the `Resizer`. One is [`beforeApplyResizer`](#beforeapplyresizer) defined on the __props__ of `Container`, and the other is [`getResizer`](#getresizer) defined on the __instance__ of `Container`.

Beware that you need __manually__ calling [`applyResizer`](#applyresizer) every time you want to apply the effect, except in `beforeApplyResizer`. Check demo [Make Section collapsible](https://codesandbox.io/s/1vpy7kz5j3) to see how `applyResizer` is used.

```typescript
interface Resizer {
  resizeSection: (indexOfSection: number, config: { toSize: number; preferMoveLeftBar?: boolean }) => void;
  moveBar: (indexOfBar: number, config: { withOffset: number; }) => void;
  discard: () => void;
  isSectionResized: (indexOfSection: number) => boolean;
  isBarActivated: (indexOfBar: number) => boolean;
  getSectionSize: (indexOfSection: number) => number | -1;
  getTotalSize: () => number;
}
```

##### `resizeSection`
Used to set size of the nth `Section`.
In multi-column layout, there're several `Bar`s could change the `Section`'s size. Therefore, you could try to use the left side `Bar` to resizing by setting `preferMoveLeftBar`.

##### `moveBar`
Used to move the nth `Bar` to resizing. 
If the value of A is negative, move `Bar` to the left. When [`vertical`](#vertical) is `true`, move up.

##### `discard`
Discard resizing at this time.

##### `isSectionResized`
Used to determine whether the nth `Section`'s size is changed at current [resizing section](#user-content-resizing-section) or not.

##### `isBarActivated`
Used to determine whether the nth `Bar` is active or not.

##### `getSectionSize`
Used to get size of the nth `Section`. if there is no nth `Section`, return `-1`.

##### `getTotalSize`
Used to get total size of all `Section`.



## Contributing
The main purpose of this repository is to continue to evolve react-simple-resizer, making it faster, smaller and easier to use. We are grateful to the community for contributing bugfixes and improvements.

#### About Demo
Feel free to let us know that you have created some new customized resize behavior. You could create a PR to let more people see your works. Also, if you find some behaviors that you cannot create, let us know too.

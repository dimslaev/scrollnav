### Scrollnav v1.2.2

The `useScrollNav` hook allows you to add a scrollable wrapper around nav items while giving you full control over the UI.

#### NPM Package

```
npm i @dims/scrollnav
```

#### Usage

```javascript
import { useScrollNav } from '@dims/scrollnav';

const ExampleNavComponent = () => {
  const listRef = React.useRef();

  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useScrollNav(
    { listRef }
  );

  return (
    <nav>
      <ul ref={listRef}>
        <li>nav item 1</li>
        <li>nav item 2</li>
        <li>nav item 3</li>
        <li>nav item 4</li>
      </ul>

      {canScrollPrev && <button onClick={scrollPrev}><</button>}
      {canScrollNext && <button onClick={scrollNext}>></button>}
    </nav>
  );
};
```

#### Example

See `./src/Example.jsx`.

Hook params:

```md
| Prop           | Type   | Required | Description                                       |
| -------------- | ------ | -------- | ------------------------------------------------- |
| listRef        | Object | yes      | Ref of the direct parent of your nav items        |
| scrollStepSize | Number | no       | % of the container width to scroll on arrow click |
| triggerUpdate  | Bool   | no       | Programatically trigger a re-render               |
```

Hook returns:

```md
| Prop               | Type         |
| ------------------ | ------------ |
| canScrollPrev      | Bool         |
| canScrollNext      | Bool         |
| scrollPrev         | Func         |
| scrollNext         | Func         |
| scrollToChildIndex | Func(number) |
```

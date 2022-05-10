### Scrollnav

```
npm i @dims/scrollnav
```

#### Example

See `./src/App.jsx` or [live example](https://codesandbox.io/s/scrollnav-8eoyv4).

#### API

```md
| Prop            | Type     | Required | Description                                                        |
| --------------- | -------- | -------- | ------------------------------------------------------------------ |
| items           | Object[] | true     | Array of menu items                                                |
| activeItemIndex | Number   | true     | Active menu item index to scroll into view                         |
| scrollStepSize  | Number   | false    | By what percentage of the container width to scroll on arrow click |
| className       | String   | false    | Custom classname for the `nav` element                             |
```

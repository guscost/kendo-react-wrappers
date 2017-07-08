# kendo-react-wrappers
Use [Kendo UI Core](https://github.com/telerik/kendo-ui-core) widgets in a React application

## Summary
These wrappers are designed as drop-in React components. Use as follows:

```js
render: function () {
  return (
    <div>
      <KW.DatePicker
        value={this.state.myDate}
        onChange={this._onChangeMyDate} />
    </div>
  );
},

// note this will be called with the new value as the argument, not an event
_onChangeMyDate: function (value) {
  this.setState({ myDate: value });
}
```

The library makes an instance of the widget only once in componentDidMount, and then new props are used to update the existing widget whenever possible.
The goal is to have the widget behave in a stateless fashion but still have pretty good performance.

You must include all props that should not revert to the widget defaults on every render. The components do not keep any internal React state and are not designed to persist configuration between renders.

## Widgets:

- Button
  - `enabled` prop uses `widget.enable()`
  - `icon` prop uses `widget.setOptions()`
  - `onClick` prop is a callback that runs on `click` event

- DatePicker
  - `value` prop uses `widget.value()`
  - `max` prop uses `widget.setOptions()`
  - `min` prop uses `widget.setOptions()`
  - `format` prop uses `widget.setOptions()`
  - `enabled` prop uses `widget.enable()`
  - `readonly` prop uses `widget.readonly()`
  - `width` prop sets uses `widget.wrapper.css()` to set the width
  - `onChange` prop is a callback that runs on `change` event

- DateTimePicker
  - `value` prop uses `widget.value()`
  - `max` prop uses `widget.setOptions()`
  - `min` prop uses `widget.setOptions()`
  - `format` prop uses `widget.setOptions()`
  - `enabled` prop uses `widget.enable()`
  - `readonly` prop uses `widget.readonly()`
  - `width` prop sets uses `widget.wrapper.css()` to set the width
  - `onChange` prop is a callback that runs on `change` event

- MaskedTextBox
  - `value` prop uses `widget.value()`
  - `enabled` prop uses `widget.enable()`
  - `readonly` prop uses `widget.readonly()`
  - `mask` prop rebuilds the widget on change
  - `rules` prop rebuilds the widget on change
  - `width` prop sets uses `widget.wrapper.css()` to set the width
  - `onChange` prop is a callback that runs on `change` event

- NumericTextBox
  - `value` prop uses `widget.value()`
  - `max` prop uses `widget.max()`
  - `min` prop uses `widget.min()`
  - `step` prop uses `widget.step()`
  - `enabled` prop uses `widget.enable()`
  - `readonly` prop uses `widget.readonly()`
  - `format` prop manually sets `widget.options` and triggers an update
  - `width` prop sets uses `widget.wrapper.css()` to set the width
  - `onChange` prop is a callback that runs on `change` and `spin` events

- DropDownList
  - `value` prop uses `widget.value()`
  - `text` prop uses `widget.text()`
  - `enabled` prop uses `widget.enable()`
  - `readonly` prop uses `widget.readonly()`
  - `data` prop uses `widget.setDataSource()`
  - `filter` prop manually sets `widget.options` and triggers an update
  - `dataTextField` prop rebuilds the widget on change
  - `dataValueField` prop rebuilds the widget on change
  - `width` prop sets uses `widget.wrapper.css()` to set the width
  - `onChange` prop is a callback that runs on `change` event

- ComboBox
  - `value` prop uses `widget.value()`
  - `text` prop uses `widget.text()`
  - `enabled` prop uses `widget.enable()`
  - `readonly` prop uses `widget.readonly()`
  - `data` prop uses `widget.setDataSource()`
  - `filter` prop manually sets `widget.options` and triggers an update
  - `dataTextField` prop rebuilds the widget on change
  - `dataValueField` prop rebuilds the widget on change
  - `width` prop sets uses `widget.wrapper.css()` to set the width
  - `onChange` prop is a callback that runs on `change` event

## `readonly` and `enabled`
In Kendo, calling `widget.enable(true)` overwrites the current value of `readonly` (setting it to `false`), and calling `widget.readonly(false)` overwrites the current value of `enabled` (setting it to `true`).  Therefore, you should only use `readonly` or `enabled`, but not both.  Otherwise you might have unexpected results.


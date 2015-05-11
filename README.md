# kendo-react-wrappers
Use Kendo UI Core widgets in a React application

## Summary
These wrappers are designed as drop-in React components. Use as follows:

    <KW.DatePicker value={this.state.datePickerValue} />

The library makes an instance of the widget only once in componentDidMount, and then new props are used to update the existing widget whenever possible.
The goal is to have the widget behave in a stateless fashion but still have pretty good performance.

You must include all props that should not revert to the widget defaults on every render. The components do not keep any internal React state and are not designed to persist configuration between renders.

## Widgets:

- DatePicker
    - `value` prop uses `widget.value()`
    - `max` prop uses `widget.setOptions()`
    - `min` prop uses `widget.setOptions()`
    - `format` prop uses `widget.setOptions()`
    - `enabled` prop uses `widget.enable()`
    - `readonly` prop uses `widget.readonly()`
    - `onChange` prop is a callback that runs on `change` event

- DateTimePicker
    - `value` prop uses `widget.value()`
    - `max` prop uses `widget.setOptions()`
    - `min` prop uses `widget.setOptions()`
    - `format` prop uses `widget.setOptions()`
    - `enabled` prop uses `widget.enable()`
    - `readonly` prop uses `widget.readonly()`
    - `onChange` prop is a callback that runs on `change` event

- MaskedTextBox
    - `value` prop uses `widget.value()`
    - `enabled` prop uses `widget.enable()`
    - `readonly` prop uses `widget.readonly()`
    - `mask` prop rebuilds the widget on change
    - `rules` prop rebuilds the widget on change
    - `onChange` prop is a callback that runs on `change` event

- NumericTextBox
    - `value` prop uses `widget.value()`
    - `max` prop uses `widget.max()`
    - `min` prop uses `widget.min()`
    - `step` prop uses `widget.step()`
    - `enabled` prop uses `widget.enable()`
    - `readonly` prop uses `widget.readonly()`
    - `format` prop manually sets `widget.options` and triggers an update
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
    - `onChange` prop is a callback that runs on `change` and `spin` events

- ComboBox
    - `value` prop uses `widget.value()`
    - `text` prop uses `widget.text()`
    - `enabled` prop uses `widget.enable()`
    - `readonly` prop uses `widget.readonly()`
    - `data` prop uses `widget.setDataSource()`
    - `filter` prop manually sets `widget.options` and triggers an update
    - `dataTextField` prop rebuilds the widget on change
    - `dataValueField` prop rebuilds the widget on change
    - `onChange` prop is a callback that runs on `change` and `spin` events

# kendo-react-wrappers
Use Kendo UI Core widgets in a React application

## Summary
These wrappers are designed as drop-in React components. Use as follows:

    <KW.DatePicker value={this.state.datePickerValue} />

The library makes an instance of the widget only once in componentDidMount, and then new props are used to update the existing widget whenever possible. 
The goal is to have the widget behave in a stateless fashion but still have good performance.

You must include all props that should not revert to the widget defaults on every render. Again, the idea is stateless components, so widgets do not have any internal state.


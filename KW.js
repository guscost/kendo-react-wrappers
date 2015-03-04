// c) 2015 Gus Cost
// may be freely distributed under the MIT license

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD module (also saved as global)
        define(['jquery', 'kendo', 'moment'], function ($, kendo, moment) {
            return (root.KW = factory($, kendo, moment));
        });
    } else if (typeof exports === 'object') {
        // Node-flavored CommonJS
        module.exports = factory(require('jquery', 'kendo', 'moment'));
    } else {
        // Browser global
        root.KW = factory(root.jQuery, root.kendo, root.moment);
    }
}(this, function ($, kendo, moment) {

    // ------------------------------
    // Input Component Mixin
    // ------------------------------
    var _kendoInputMixin = {

        propTypes: {
            id: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                id: '',
                className: '',
                style: {}
            };
        },

        // never re-render input components, since kendo handles updates
        // we manage id, class, and style updates separately
        shouldComponentUpdate: function (nextProps, nextState) {
            return false;
        },

        // if universal props are updated, update the relevant HTML attributes leaving the DOM intact
        // the nextProps will only be different after the second time, so we assume the widget has already been initialized
        componentWillReceiveProps: function (nextProps) {

            // id attribute is just a direct update
            if (nextProps.id !== this.props.id) {
                $(this.getDOMNode()).attr('id', nextProps.id);
            }

            // class updates have to take into account auto-generated kendo classes
            // these should be left alone, but all classes from props should be stateless
            if (nextProps.className !== this.props.className) {

                // calculate classes we need to remove and add
                var prevClasses = this.props.className.split(' ');
                var nextClasses = nextProps.className.split(' ');
                var classesToRemove = $.map(prevClasses, function (v, i) { return nextClasses.indexOf(v) > 1 ? null : v; });
                var classesToAdd = $.map(nextClasses, function (v, i) { return prevClasses.indexOf(v) > 1 ? null : v; });

                // update classes on input node
                var $node = $(this.getDOMNode());
                $node.removeClass(classesToRemove.join(' ')).addClass(classesToAdd.join(' '));

                // wrapper should have class k-widget, custom classes are copied here on init
                var $wrapper = $node.closest('.k-widget');
                $wrapper.removeClass(classesToRemove.join(' ')).addClass(classesToAdd.join(' '));

                // NumericTextBox also has a "formatted" input that is swapped with the real input
                var $formatted = $node.parent().find('.k-formatted-value');
                $formatted.removeClass(classesToRemove.join(' ')).addClass(classesToAdd.join(' '));
            }

            // kendo does not alter style except for making swapped inputs invisible
            // the visibility style is still being updated so we can just reset every time
            if (nextProps.style !== this.props.style) {
                var $node = $(this.getDOMNode());
                $node.removeAttr('style');
                $node.css(nextProps.style);

                var $wrapper = $node.closest('.k-widget');
                $wrapper.removeAttr('style');
                $wrapper.css(nextProps.style);

                var $formatted = $node.parent().find('.k-formatted-value');
                $formatted.removeAttr('style');
                $formatted.css(nextProps.style);
            }
        },

        render: function () {
            return React.createElement('input', {
                id: this.props.id,
                className: this.props.className,
                style: this.props.style
            });
        }
    };

    // ------------------------------
    // DatePicker component
    // ------------------------------
    var DatePicker = React.createClass({

        mixins: [_kendoInputMixin],

        propTypes: {
            value: React.PropTypes.string, // dates are passed as ISO format strings
            max: React.PropTypes.string,
            min: React.PropTypes.string,
            format: React.PropTypes.string,
            enabled: React.PropTypes.bool,
            readonly: React.PropTypes.bool
        },

        getDefaultProps: function () {
            return {
                value: '',
                max: '9999-12-31',
                min: '0001-01-01',
                format: 'd',
                enabled: true,
                readonly: false
            };
        },

        componentDidMount: function () {
            var $node = $(this.getDOMNode());
            $node.kendoDatePicker({
                value: this.props.value,
                max: this.props.max,
                min: this.props.min,
                format: this.props.format
            });
            var widget = $node.data('kendoDatePicker');
            widget.enable(this.props.enabled);
            widget.readonly(this.props.readonly);
            widget.bind('change', this._onChange);
        },

        componentWillUnmount: function () {
            $(this.getDOMNode()).data('kendoDatePicker').destroy();
        },

        componentWillReceiveProps: function (nextProps) {
            var widget = $(this.getDOMNode()).data('kendoDatePicker');
            var newOptions = {};

            // these props have setter functions
            if (nextProps.value !== this.props.value) { widget.value(moment(nextProps.value).toDate()); }
            if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }
            if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }

            // build new options object to set these
            if (nextProps.max !== this.props.max) { newOptions.max = moment(nextProps.max).toDate(); }
            if (nextProps.min !== this.props.min) { newOptions.min = moment(nextProps.min).toDate(); }
            if (nextProps.format !== this.props.format) { newOptions.format = nextProps.format; }
            if (newOptions) { widget.setOptions(newOptions); }
        },

        _onChange: function (event) {
            var newValue = moment($(event.sender.element).data('kendoDatePicker').value()).toISOString();
            if (newValue !== this.props.value) { this.props.onChange(newValue); }
        }
    });

    // ------------------------------
    // NumericTextBox component
    // ------------------------------
    var NumericTextBox = React.createClass({

        mixins: [_kendoInputMixin],

        propTypes: {
            value: React.PropTypes.number,
            max: React.PropTypes.number,
            min: React.PropTypes.number,
            step: React.PropTypes.number,
            format: React.PropTypes.string,
            enabled: React.PropTypes.bool,
            readonly: React.PropTypes.bool
        },

        getDefaultProps: function () {
            return {
                value: null,
                max: Infinity,
                min: -Infinity,
                step: 1,
                format: '0.00',
                enabled: true,
                readonly: false
            };
        },

        componentDidMount: function () {
            var $node = $(this.getDOMNode());
            $node.kendoNumericTextBox({
                value: this.props.value,
                max: this.props.max,
                min: this.props.min,
                step: this.props.step,
                format: this.props.format
            });

            // set initial enabled and readonly settings
            var widget = $node.data("kendoNumericTextBox");
            widget.enable(this.props.enabled);
            widget.readonly(this.props.readonly);

            // bind to widget events
            widget.bind('change', this._onChange);
            widget.bind('spin', this._onChange);
        },

        componentWillUnmount: function () {
            $(this.getDOMNode()).data('kendoNumericTextBox').destroy();
        },

        componentWillReceiveProps: function (nextProps) {
            var widget = $(this.getDOMNode()).data('kendoNumericTextBox');
            if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
            if (nextProps.max !== this.props.max) { widget.max(nextProps.max); }
            if (nextProps.min !== this.props.min) { widget.min(nextProps.min); }
            if (nextProps.step !== this.props.step) { widget.step(nextProps.step); }
            if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }
            if (nextProps.enabled !== this.props.readonly) { widget.readonly(nextProps.readonly); }
            // the format prop does not have a dedicated setter
            if (nextProps.format !== this.props.format) {
                widget.options.format = nextProps.format;
                widget.value(widget.value()); // this updates the UI with the new format immediately
            }
        },

        _onChange: function (event) {
            var newValue = $(event.sender.element).data('kendoNumericTextBox').value();
            if (newValue !== this.props.value) { this.props.onChange(newValue); }
        }
    });

    // ------------------------------
    // ComboBox component
    // ------------------------------
    var ComboBox = React.createClass({

        mixins: [_kendoInputMixin],

        getDefaultProps: function () {
            return {
                text: '',
                value: '',
                filter: null,
                data: [],
                textField: null,
                valueField: null
            };
        },

        propTypes: {
            text: React.PropTypes.string,
            value: React.PropTypes.string,
            filter: React.PropTypes.object,
            data: React.PropTypes.array,
            textField: React.PropTypes.string,
            valueField: React.PropTypes.string
        },

        componentDidMount: function () {
            var $node = $(this.getDOMNode())
            $node.kendoComboBox({
                text: this.props.text,
                value: this.props.value,
                filter: this.props.filter,
                dataSource: this.props.data,
                dataTextField: this.props.textField,
                dataValueField: this.props.valueField
            });
            $node.data("kendoComboBox").bind('change', this._onChange);
        },

        componentWillUnmount: function () {
            $(this.getDOMNode()).data('kendoComboBox').destroy();
        },

        componentWillReceiveProps: function (nextProps) {
            var $node = $(this.getDOMNode());
            var widget = $node.data('kendoComboBox');
            if (nextProps.textField !== this.props.textField || nextProps.valueField !== this.props.valueField) {
                // destroy and rebuild widget if dataTextField or dataValueField changes (keep it stateless even in this case!)
                widget.destroy();
                $node.kendoComboBox({
                    text: nextProps.text,
                    value: nextProps.value,
                    filter: nextProps.filter,
                    dataSource: nextProps.data,
                    dataTextField: nextProps.textField,
                    dataValueField: nextProps.valueField
                });
                $node.data("kendoComboBox").bind('change', this._onChange);
            } else {
                // update other props individually
                if (nextProps.text !== this.props.text) { widget.text(nextProps.text); }
                if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
                if (nextProps.data !== this.props.data) { widget.setDataSource(nextProps.data); }
                if (nextProps.filter !== this.props.filter) { widget.options.filter = nextProps.filter; }
            }
        },

        _onChange: function (event) {
            var newValue = $(event.sender.element).data('kendoComboBox').value();
            if (newValue !== this.props.value) { this.props.onChange(newValue); }
        }
    });

    return {
        DatePicker: DatePicker,
        NumericTextBox: NumericTextBox,
        ComboBox: ComboBox
    };
}));
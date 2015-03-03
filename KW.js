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
        root.KW = factory((root.jQuery || root.Zepto || root.ender || root.$), root.kendo, root.moment);
    }
}(this, function ($, kendo, moment) {

	// return a default if the provided value is null or undefined
    var _default = function (v, d) { return v == null ? d : v; };

    // kendo input components use this mixin
    var _kendoInputMixin = {

        // prop types
        propTypes: {
            id: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object
        },

        // never re-render input components, since kendo handles updates
        shouldComponentUpdate: function (nextProps, nextState) {
            return false;
        },

        // render the input component 
        render: function () {
            return React.createElement("input", {
                id: this.props.id,
                className: this.props.className,
                style: this.props.style
            });
        }
    };
    
    // defaults for DatePicker
    var _defaultDateMax = '9999-12-31';
    var _defaultDateMin = '0001-01-01';
    var _defaultDateFormat = 'd';

    // DatePicker component
    var DatePicker = React.createClass({

        mixins: [_kendoInputMixin],

        // prop types unique to DatePicker
        propTypes: {
            value: React.PropTypes.string, // dates are passed as ISO format strings
            max: React.PropTypes.string,
            min: React.PropTypes.string,
            format: React.PropTypes.string,
            enabled: React.PropTypes.bool,
            readonly: React.PropTypes.bool
        },

        // initialize widget
        componentDidMount: function () {
            var $node = $(this.getDOMNode());
            $node.kendoDatePicker({
                value: this.props.value,
                max: _default(this.props.max, _defaultDateMax),
                min: _default(this.props.min, _defaultDateMin),
                format: _default(this.props.format, _defaultDateFormat)
            });
            var widget = $node.data('kendoDatePicker');
            widget.enable(_default(this.props.enabled, true));
            widget.readonly(_default(this.props.readonly, false));
            widget.bind('change', this._onChange);
        },

        // destroy widget
        componentWillUnmount: function () {
            $(this.getDOMNode()).data('kendoDatePicker').destroy();
        },

        // if new props have been sent, update the widget
        componentWillReceiveProps: function (nextProps) {
            var widget = $(this.getDOMNode()).data('kendoDatePicker');
            var newOptions = {};
			
			// these props have setter functions
			if (nextProps.value !== this.props.value) { widget.value(moment(nextProps.value).toDate()); }
            if (nextProps.enabled !== this.props.enabled) { widget.enable(_default(nextProps.enabled, true)); }
            if (nextProps.readonly !== this.props.readonly) { widget.readonly(_default(nextProps.readonly, false)); }
			
            // build new options object to set these
            if (nextProps.max !== this.props.max) { newOptions.max = moment(_default(nextProps.max, _defaultDateMax)).toDate(); }
            if (nextProps.min !== this.props.min) { newOptions.min = moment(_default(nextProps.min, _defaultDateMin)).toDate(); }
            if (nextProps.format !== this.props.format) { newOptions.format = _default(nextProps.format, _defaultDateFormat); }
            if (newOptions) { widget.setOptions(newOptions); }
        },

        // on change, pass new value to callback
        _onChange: function (event) {
            var newValue = moment($(event.sender.element).data('kendoDatePicker').value()).toISOString();
            if (newValue !== this.props.value) { this.props.onChange(newValue); }
        }
    });


    // defaults for NumericTextBox
    var _defaultNumberMax = Infinity;
    var _defaultNumberMin = -Infinity;
    var _defaultNumberStep = 1;
    var _defaultNumberFormat = '0.00';

    // NumericTextBox component
    var NumericTextBox = React.createClass({

        mixins: [_kendoInputMixin],

        // prop types unique to numeric text box
        propTypes: {
            value: React.PropTypes.number,
            max: React.PropTypes.number,
            min: React.PropTypes.number,
            step: React.PropTypes.number,
            format: React.PropTypes.string,
            enabled: React.PropTypes.bool,
            readonly: React.PropTypes.bool
        },

        // initialize kendo widget
        componentDidMount: function () {
            var $node = $(this.getDOMNode());
            $node.kendoNumericTextBox({
                value: this.props.value,
                max: _default(this.props.max, _defaultNumberMax),
                min: _default(this.props.min, _defaultNumberMin),
                step: _default(this.props.step, _defaultNumberStep),
                format: _default(this.props.format, _defaultNumberFormat)
            });
			// set initial enabled and readonly settings
            var widget = $node.data("kendoNumericTextBox");
            widget.enable(_default(this.props.enabled, true));
            widget.readonly(_default(this.props.readonly, false));		
			// bind to widget events
            widget.bind('change', this._onChange);
            widget.bind('spin', this._onChange);
        },

        // destroy kendo widget
        componentWillUnmount: function () {
            $(this.getDOMNode()).data('kendoNumericTextBox').destroy();
        },

        // if new props have been sent, update the widget
        componentWillReceiveProps: function (nextProps) {
            var widget = $(this.getDOMNode()).data('kendoNumericTextBox');
            if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
            if (nextProps.max !== this.props.max) { widget.max(_default(nextProps.max, _defaultNumberMax)); }
            if (nextProps.min !== this.props.min) { widget.min(_default(nextProps.min, _defaultNumberMin)); }
            if (nextProps.step !== this.props.step) { widget.step(_default(nextProps.step, _defaultNumberStep)); }
            if (nextProps.enabled !== this.props.enabled) { widget.enable(_default(nextProps.enabled, true)); }
            if (nextProps.enabled !== this.props.readonly) { widget.readonly(_default(nextProps.readonly, false)); }
			// the format prop does not have a dedicated setter
            if (nextProps.format !== this.props.format) {
                widget.options.format = _default(nextProps.format, _defaultNumberFormat);
                widget.value(widget.value()); // this updates the UI with the new format immediately
            }
        },

        // on change, pass new value to callback
        _onChange: function (event) {
            var newValue = $(event.sender.element).data('kendoNumericTextBox').value();
            if (newValue !== this.props.value) { this.props.onChange(newValue); }
        }
    });
    
    return {
		DatePicker: DatePicker,
		NumericTextBox: NumericTextBox
	};
}));

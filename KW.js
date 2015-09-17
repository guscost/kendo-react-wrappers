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

      //if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) { console.log("kendo update"); }

      // check if we need to do anything
      if (
        nextProps.id !== this.props.id ||
        nextProps.className !== this.props.className ||
        nextProps.style !== this.props.style
      ) {
        // save DOM reference
        var $node = $(this.getDOMNode());

        // id attribute is just a direct update
        if (nextProps.id !== this.props.id) {
          $node.attr('id', nextProps.id);
        }

        // check if we will need additional DOM references
        if (
          nextProps.className !== this.props.className ||
          nextProps.style !== this.props.style
        ) {
          // save additional DOM references
          var $wrapper = $node.closest('.k-widget');
          var $formatted = $node.parent().find('.k-formatted-value');

          // class updates have to take into account auto-generated kendo classes
          // these should be left alone, but all classes from props should be stateless
          if (nextProps.className !== this.props.className) {

            // calculate classes we need to remove and add
            var prevClasses = this.props.className.split(' ');
            var nextClasses = nextProps.className.split(' ');
            var classesToRemove = $.map(prevClasses, function (v, i) { return nextClasses.indexOf(v) > 1 ? null : v; });
            var classesToAdd = $.map(nextClasses, function (v, i) { return prevClasses.indexOf(v) > 1 ? null : v; });

            // update classes on input node
            $node.removeClass(classesToRemove.join(' ')).addClass(classesToAdd.join(' '));
            // wrapper should have class k-widget, custom classes are copied here on init
            $wrapper.removeClass(classesToRemove.join(' ')).addClass(classesToAdd.join(' '));
            // NumericTextBox also has a "formatted" input that is swapped with the real input
            $formatted.removeClass(classesToRemove.join(' ')).addClass(classesToAdd.join(' '));
          }

          // kendo does not alter style except for making swapped inputs invisible
          // the visibility style is still being updated so we can just reset every time
          if (nextProps.style !== this.props.style) {
            $node.removeAttr('style');
            $node.css(nextProps.style);
            $wrapper.removeAttr('style');
            $wrapper.css(nextProps.style);
            $formatted.removeAttr('style');
            $formatted.css(nextProps.style);
          }
        }
      }
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
        format: 'MM/dd/yyyy',
        enabled: true,
        readonly: false
      };
    },

    componentDidMount: function () {
      var $node = $(this.getDOMNode());
      $node.kendoDatePicker({
        value: this.props.value ? moment(this.props.value).toDate() : "",
        max: this.props.max,
        min: this.props.min,
        format: this.props.format
      });
      var widget = $node.data('kendoDatePicker');
      widget.readonly(this.props.readonly);
      widget.enable(this.props.enabled);
      widget.bind('change', this._onChange);
    },

    componentWillUnmount: function () {
      $(this.getDOMNode()).data('kendoDatePicker').destroy();
    },

    componentWillReceiveProps: function (nextProps) {
      if (
        nextProps.value !== this.props.value ||
        nextProps.enabled !== this.props.enabled ||
        nextProps.readonly !== this.props.readonly ||
        nextProps.max !== this.props.max ||
        nextProps.min !== this.props.min ||
        nextProps.format !== this.props.format
      ) {
        var widget = $(this.getDOMNode()).data('kendoDatePicker');
        var newOptions = {};

        // these props have setter functions
        if (nextProps.value !== this.props.value) { widget.value(moment(nextProps.value).toDate()); }
        if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }
        if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }

        // build new options object to set these
        if (nextProps.max !== this.props.max) { newOptions.max = moment(nextProps.max).toDate(); }
        if (nextProps.min !== this.props.min) { newOptions.min = moment(nextProps.min).toDate(); }
        if (nextProps.format !== this.props.format) { newOptions.format = nextProps.format; }
        if (newOptions) { widget.setOptions(newOptions); }
      }
    },

    render: function () {
      return React.createElement('div', {
        id: this.props.id,
        className: this.props.className,
        style: this.props.style
      });
    },

    _onChange: function (event) {
      var newValue = moment($(event.sender.element).data('kendoDatePicker').value()).toISOString();
      if (newValue !== this.props.value) { this.props.onChange(newValue); }
    }
  });

  // ------------------------------
  // DateTimePicker component
  // ------------------------------
  var DateTimePicker = React.createClass({

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
        max: '9999-12-31T23:59:59Z',
        min: '0001-01-01T00:00:00Z',
        format: 'MM/dd/yyyy h:mm tt',
        enabled: true,
        readonly: false
      };
    },

    componentDidMount: function () {
      var $node = $(this.getDOMNode());
      $node.kendoDateTimePicker({
        value: this.props.value ? moment(this.props.value).toDate() : "",
        max: this.props.max,
        min: this.props.min,
        format: this.props.format
      });
      var widget = $node.data('kendoDateTimePicker');
      widget.enable(this.props.enabled);
      widget.readonly(this.props.readonly);
      widget.bind('change', this._onChange);
    },

    componentWillUnmount: function () {
      $(this.getDOMNode()).data('kendoDateTimePicker').destroy();
    },

    componentWillReceiveProps: function (nextProps) {
      if (
        nextProps.value !== this.props.value ||
        nextProps.enabled !== this.props.enabled ||
        nextProps.readonly !== this.props.readonly ||
        nextProps.max !== this.props.max ||
        nextProps.min !== this.props.min ||
        nextProps.format !== this.props.format
      ) {
        var widget = $(this.getDOMNode()).data('kendoDateTimePicker');
        var newOptions = {};

        // these props have setter functions
        if (nextProps.value !== this.props.value) { widget.value(moment(nextProps.value).toDate()); }
        if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }
        if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }

        // build new options object to set these
        if (nextProps.max !== this.props.max) { newOptions.max = moment(nextProps.max).toDate(); }
        if (nextProps.min !== this.props.min) { newOptions.min = moment(nextProps.min).toDate(); }
        if (nextProps.format !== this.props.format) { newOptions.format = nextProps.format; }
        if (newOptions) { widget.setOptions(newOptions); }
      }
    },

    render: function () {
      return React.createElement('div', {
        id: this.props.id,
        className: this.props.className,
        style: this.props.style
      });
    },

    _onChange: function (event) {
      var newValue = moment($(event.sender.element).data('kendoDateTimePicker').value()).toISOString();
      if (newValue !== this.props.value) { this.props.onChange(newValue); }
    }
  });

  // ------------------------------
  // MaskedTextBox component
  // ------------------------------
  var MaskedTextBox = React.createClass({

    mixins: [_kendoInputMixin],

    propTypes: {
      value: React.PropTypes.number,
      mask: React.PropTypes.string,
      rules: React.PropTypes.object,
      enabled: React.PropTypes.bool,
      readonly: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        value: null,
        mask: null,
        rules: null,
        enabled: true,
        readonly: false
      };
    },

    componentDidMount: function () {
      var $node = $(this.getDOMNode());
      $node.kendoMaskedTextBox({
        value: this.props.value,
        mask: this.props.mask,
        rules: this.props.rules
      });

      // set initial enabled and readonly settings
      var widget = $node.data("kendoMaskedTextBox");
      widget.readonly(this.props.readonly);
      widget.enable(this.props.enabled);

      // bind to widget events
      widget.bind('change', this._onChange);
    },

    componentWillUnmount: function () {
      $(this.getDOMNode()).data('kendoMaskedTextBox').destroy();
    },

    componentWillReceiveProps: function (nextProps) {
      if (
        nextProps.value !== this.props.value ||
        nextProps.readonly !== this.props.readonly ||
        nextProps.enabled !== this.props.enabled ||
        nextProps.mask !== this.props.mask ||
        nextProps.rules !== this.props.rules
      ) {
        var $node = $(this.getDOMNode());
        var widget = $node.data('kendoMaskedTextBox');
        if (nextProps.mask !== this.props.mask || nextProps.rules !== this.props.rules) {
          // destroy and rebuild widget if mask or rules changes (keep it stateless!)
          widget.destroy();
          $node.kendoDropDownList({
            value: nextProps.value,
            mask: nextProps.mask,
            rules: nextProps.rules
          });
          widget = $node.data('kendoDropDownList');
          widget.readonly(this.props.readonly);
          widget.enable(this.props.enabled);
          widget.bind('change', this._onChange);
        } else {
          if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
          if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }
          if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }
        }
      }
    },

    render: function () {
      return React.createElement('div', {
        id: this.props.id,
        className: this.props.className,
        style: this.props.style
      });
    },

    _onChange: function (event) {
      var newValue = $(event.sender.element).data('kendoMaskedTextBox').value();
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
      widget.readonly(this.props.readonly);
      widget.enable(this.props.enabled);

      // bind to widget events
      widget.bind('change', this._onChange);
      widget.bind('spin', this._onChange);
    },

    componentWillUnmount: function () {
      $(this.getDOMNode()).data('kendoNumericTextBox').destroy();
    },

    componentWillReceiveProps: function (nextProps) {
      if (nextProps.value !== this.props.value ||
        nextProps.max !== this.props.max ||
        nextProps.min !== this.props.min ||
        nextProps.step !== this.props.step ||
        nextProps.readonly !== this.props.readonly ||
        nextProps.enabled !== this.props.enabled ||
        nextProps.format !== this.props.format
      ) {
        var widget = $(this.getDOMNode()).data('kendoNumericTextBox');
        if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
        if (nextProps.max !== this.props.max) { widget.max(nextProps.max); }
        if (nextProps.min !== this.props.min) { widget.min(nextProps.min); }
        if (nextProps.step !== this.props.step) { widget.step(nextProps.step); }
        if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }
        if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }
        // the format prop does not have a dedicated setter
        if (nextProps.format !== this.props.format) {
          widget.options.format = nextProps.format;
          widget.value(widget.value()); // this updates the UI with the new format immediately
        }
      }
    },

    // NumericTextBox can't be based on a div element
    render: function () {
      return React.createElement('input', {
        id: this.props.id,
        className: this.props.className,
        style: this.props.style
      });
    },

    _onChange: function (event) {
      var newValue = $(event.sender.element).data('kendoNumericTextBox').value();
      if (newValue !== this.props.value) { this.props.onChange(newValue); }
    }
  });

  // ------------------------------
  // DropDownList component
  // ------------------------------
  var DropDownList = React.createClass({

    mixins: [_kendoInputMixin],

    getDefaultProps: function () {
      return {
        value: '',
        text: '',
        enabled: true,
        readonly: false,
        filter: undefined,
        data: [],
        dataTextField: null,
        dataValueField: null
      };
    },

    propTypes: {
      value: React.PropTypes.string,
      text: React.PropTypes.string,
      readonly: React.PropTypes.bool,
      enabled: React.PropTypes.bool,
      filter: React.PropTypes.object,
      data: React.PropTypes.array,
      dataTextField: React.PropTypes.string,
      dataValueField: React.PropTypes.string
    },

    componentDidMount: function () {
      var $node = $(this.getDOMNode())
      $node.kendoDropDownList({
        animation: false,
        value: this.props.value,
        text: this.props.text,
        filter: this.props.filter,
        dataSource: this.props.data,
        dataTextField: this.props.dataTextField,
        dataValueField: this.props.dataValueField
      });
      var widget = $node.data('kendoDropDownList');
      widget.readonly(this.props.readonly);
      widget.enable(this.props.enabled);
      widget.bind('change', this._onChange);
    },

    componentWillUnmount: function () {
      $(this.getDOMNode()).data('kendoDropDownList').destroy();
    },

    componentWillReceiveProps: function (nextProps) {
      if (
        nextProps.value !== this.props.value ||
        nextProps.text !== this.props.text ||
        nextProps.enabled !== this.props.enabled ||
        nextProps.readonly !== this.props.readonly ||
        nextProps.data !== this.props.data ||
        nextProps.filter !== this.props.filter ||
        nextProps.dataTextField !== this.props.dataTextField ||
        nextProps.dataValueField !== this.props.dataValueField
      ) {
        var $node = $(this.getDOMNode());
        var widget = $node.data('kendoDropDownList');
        if (
          nextProps.dataTextField !== this.props.dataTextField ||
          nextProps.dataValueField !== this.props.dataValueField
        ) {
          // destroy and rebuild widget if dataTextField or dataValueField changes (keep it stateless!)
          widget.destroy();
          $node.kendoDropDownList({
            animation: false,
            text: nextProps.text,
            value: nextProps.value,
            filter: nextProps.filter,
            dataSource: nextProps.data,
            dataTextField: nextProps.dataTextField,
            dataValueField: nextProps.dataValueField
          });
          widget = $node.data('kendoDropDownList');
          widget.readonly(this.props.readonly);
          widget.enable(this.props.enabled);
          widget.bind('change', this._onChange);
        } else {
          // update other props individually
          if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
          if (nextProps.text !== this.props.text) { widget.text(nextProps.text); }
          if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }
          if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }
          if (nextProps.data !== this.props.data) { widget.setDataSource(nextProps.data); }
          if (nextProps.filter !== this.props.filter) { widget.options.filter = nextProps.filter; }
        }
      }
    },

    // DropDownList must be a div element to allow setting width properly
    render: function () {
      return React.createElement('div', {
        id: this.props.id,
        className: this.props.className,
        style: this.props.style
      });
    },

    _onChange: function (event) {
      var newValue = $(event.sender.element).data('kendoDropDownList').value();
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
        value: '',
        text: '',
        enabled: true,
        readonly: false,
        filter: undefined,
        data: [],
        dataTextField: null,
        dataValueField: null
      };
    },

    propTypes: {
      value: React.PropTypes.string,
      text: React.PropTypes.string,
      readonly: React.PropTypes.bool,
      enabled: React.PropTypes.bool,
      filter: React.PropTypes.object,
      data: React.PropTypes.array,
      dataTextField: React.PropTypes.string,
      dataValueField: React.PropTypes.string
    },

    componentDidMount: function () {
      var $node = $(this.getDOMNode())
      $node.kendoComboBox({
        value: this.props.value,
        text: this.props.text,
        filter: this.props.filter,
        dataSource: this.props.data,
        dataTextField: this.props.dataTextField,
        dataValueField: this.props.dataValueField
      });
      var widget = $node.data('kendoComboBox');
      widget.readonly(this.props.readonly);
      widget.enable(this.props.enabled);
      widget.bind('change', this._onChange);
    },

    componentWillUnmount: function () {
      $(this.getDOMNode()).data('kendoComboBox').destroy();
    },

    componentWillReceiveProps: function (nextProps) {
      if (
        nextProps.value !== this.props.value ||
        nextProps.text !== this.props.text ||
        nextProps.readonly !== this.props.readonly ||
        nextProps.enabled !== this.props.enabled ||
        nextProps.data !== this.props.data ||
        nextProps.filter !== this.props.filter ||
        nextProps.dataTextField !== this.props.dataTextField ||
        nextProps.dataValueField !== this.props.dataValueField
      ) {
        var $node = $(this.getDOMNode());
        var widget = $node.data('kendoComboBox');
        if (
          nextProps.dataTextField !== this.props.dataTextField ||
          nextProps.dataValueField !== this.props.dataValueField
        ) {
          // destroy and rebuild widget if dataTextField or dataValueField changes (keep it stateless!)
          widget.destroy();
          $node.kendoComboBox({
            text: nextProps.text,
            value: nextProps.value,
            filter: nextProps.filter,
            dataSource: nextProps.data,
            dataTextField: nextProps.dataTextField,
            dataValueField: nextProps.dataValueField
          });
          widget = $node.data('kendoComboBox');
          widget.readonly(this.props.readonly);
          widget.enable(this.props.enabled);
          widget.bind('change', this._onChange);
        } else {
          // update other props individually
          if (nextProps.value !== this.props.value) { widget.value(nextProps.value); }
          if (nextProps.text !== this.props.text) { widget.text(nextProps.text); }
          if (nextProps.readonly !== this.props.readonly) { widget.readonly(nextProps.readonly); }
          if (nextProps.enabled !== this.props.enabled) { widget.enable(nextProps.enabled); }
          if (nextProps.data !== this.props.data) { widget.setDataSource(nextProps.data); }
          if (nextProps.filter !== this.props.filter) { widget.options.filter = nextProps.filter; }
        }
      }
    },

    render: function () {
      return React.createElement('div', {
        id: this.props.id,
        className: this.props.className,
        style: this.props.style
      });
    },

    _onChange: function (event) {
      var newValue = $(event.sender.element).data('kendoComboBox').value();
      if (newValue !== this.props.value) { this.props.onChange(newValue); }
    }
  });

  return {
    DatePicker: DatePicker,
    DateTimePicker: DateTimePicker,
    MaskedTextBox: MaskedTextBox,
    NumericTextBox: NumericTextBox,
    DropDownList: DropDownList,
    ComboBox: ComboBox
  };
}));

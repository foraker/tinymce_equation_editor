window.EquationEditor = {};

EquationEditor.Events = {
  on(name, callback, context) {
    if (!this._events) { this._events = {}; }
    if (!this._events[name]) { this._events[name] = []; }
    return this._events[name].push({callback, context: context || this});
  },

  trigger(name) {
    let events;
    if (!this._events) { return; }
    const args = Array.prototype.slice.call(arguments, 1);
    if (events = this._events[name]) {
      return this.triggerEvents(events, args);
    }
  },

  triggerEvents(events, args) {
    return Array.from(events).map((event) =>
      event.callback.call(event.context, ...Array.from(args)));
  }
};

EquationEditor.View = class View {
  find(selector) {
    return this.$el.find(selector);
  }

  constructor(options) {
    this.options = options;
    this.$el = this.options.$el || $(this.options.el);
    this.initialize.apply(this, arguments);
  }

  initialize() {}

  createElement() {
    return this.$el = $(this.template());
  }
};

EquationEditor.CollapsibleView = class CollapsibleView extends EquationEditor.View {

  constructor(...args) {
    super(...args);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  initialize() {
    return this.find('.collapsible-box-toggle').on('click', jQuery.proxy(this.toggleCollapse, this));
  }

  toggleCollapse(e) {
    e.preventDefault();
    if (this.find('.box-content-collapsible').is(':visible')) {
      return this.closeCollapsible();
    } else {
      return this.openCollapsible();
    }
  }

  openCollapsible() {
    this.find('.box-content-collapsible').slideDown();
    return this.toggleOpenClass();
  }

  closeCollapsible() {
    this.find('.box-content-collapsible').slideUp();
    return this.toggleOpenClass();
  }

  toggleOpenClass() {
    return this.find('.collapsible-box-toggle').toggleClass('collapsible-box-toggle-open');
  }
};

EquationEditor.Buttons = {};

EquationEditor.Buttons.BaseButtonView = class BaseButtonView extends EquationEditor.View {
  constructor(...args) {
    super(...args);
    this.handleClick = this.handleClick.bind(this);
  }

  initialize() {
    this.latex      = this.options.latex;
    this.buttonText = this.options.buttonText || this.options.latex;
    return this.className  = ['math-button', this.options.className].join(' ').trim();
  }

  handleClick(e) {
    e.preventDefault();
    return EquationEditor.Events.trigger(`latex:${this.event}`, this.latex);
  }

  render() {
    this.createElement();
    this.find('a').on('click', jQuery.proxy(this.handleClick, this));
    return this;
  }

  template() {
    return `\
<div class="${this.className}">
  <a title="${this.buttonText}" href="#">${this.buttonText}</a>
</div>\
`;
  }
};

let Cls = (EquationEditor.Buttons.CommandButtonView = class CommandButtonView extends EquationEditor.Buttons.BaseButtonView {
  static initClass() {
    this.prototype.event = 'command';
  }
});
Cls.initClass();

Cls = (EquationEditor.Buttons.WriteButtonView = class WriteButtonView extends EquationEditor.Buttons.BaseButtonView {
  static initClass() {
    this.prototype.event = 'write';
  }
});
Cls.initClass();

EquationEditor.ButtonGroupView = class ButtonGroupView extends EquationEditor.View {
  constructor(...args) {
    super(...args);
    this.toggle = this.toggle.bind(this);
  }

  initialize() {
    this.groupName   = this.options.groupName;
    return this.buttonViews = this.options.buttonViews;
  }

  render() {
    this.createElement();
    this.renderButtons();
    new EquationEditor.CollapsibleView({$el: this.$el});
    this.find('header').click(this.toggle);
    return this;
  }

  toggle() {
    return this.find('.collapsible-box-toggle').click();
  }

  renderButtons() {
    return Array.from(this.buttonViews).map((buttonView) =>
      this.find('.buttons').append(buttonView.render().$el));
  }

  template() {
    return `\
<div class="button-group collapsible">
  <a href='#' class='collapsible-box-toggle ss-dropdown'></a> <header>${this.groupName}</header>

  <div class="buttons box-content-collapsible hidden"></div>
</div>\
`;
  }
};

EquationEditor.ButtonViewFactory = {
  create(config) {
    const buttons = [];

    for (let buttonConfig of Array.from(config)) {
      const klass = eval(buttonConfig.klass);
      buttons.push(new klass(buttonConfig));
    }

    return buttons;
  }
};

EquationEditor.ButtonGroupViewFactory = {
  create(config) {
    const buttonGroups = [];

    for (let buttonGroupConfig of Array.from(config)) {
      buttonGroupConfig.buttonViews = EquationEditor.ButtonViewFactory.create(buttonGroupConfig.buttonViews);
      buttonGroups.push(new EquationEditor.ButtonGroupView(buttonGroupConfig));
    }

    return buttonGroups;
  }
};

const { Buttons } = EquationEditor;
const ButtonGroup = EquationEditor.ButtonGroupView;

(function() {
  let MQ = undefined;
  const Cls = (EquationEditor.EquationEditorView = class EquationEditorView extends EquationEditor.View {
    constructor(...args) {
      super(...args);
      this.handleCommandButton = this.handleCommandButton.bind(this);
      this.handleWriteButton = this.handleWriteButton.bind(this);
      this.focus = this.focus.bind(this);
    }

    static initClass() {
      MQ = MathQuill.getInterface(2);
    }

    initialize() {
      this.existingLatex = this.options.existingLatex;
      this.restrictions  = this.options.restrictions || {};
      EquationEditor.Events.on('latex:command', this.handleCommandButton, this);
      return EquationEditor.Events.on('latex:write', this.handleWriteButton, this);
    }

    render() {
      $.getJSON('config.json').done(config => {
        this.config = config;
        this.addButtonBar();
        this.addButtonGroups();
        return this.enableMathMagic();
      });
      return this;
    }

    enableMathMagic() {
      const mathquills = this.find('.math-button a');
      if (mathquills.length > 0) {
        for (let i = 0, end = mathquills.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
          MQ.StaticMath(mathquills[i]);
        }
      }
      // MathQuill needs the DOM element not the jquery element.
      this.mathfield = MQ.MathField(this.input().get()[0]);
      if (this.existingLatex != null) {
        this.mathfield.latex(this.existingLatex);
      }
      //this.mathfield;
      return this.focus();
    }

    input() {
      return this.find('.math');
    }

    addButtonBar() {
      return Array.from(this.buttonBarButtons()).map((button) =>
        this.find('.button-bar').append(button.render().$el));
    }

    addButtonGroups() {
      return Array.from(this.buttonGroups()).map((buttonGroup) =>
        this.find('.button-groups').append(buttonGroup.render().$el));
    }

    buttonBarButtons() {
      return EquationEditor.ButtonViewFactory.create(this.config.buttonBar);
    }

    buttonGroups() {
      let groups = this.basicButtonGroups();
      if (!this.restrictions.disallow_intermediate) { groups = groups.concat(this.intermediateButtonGroups()); }
      if (!this.restrictions.disallow_advanced) { groups = groups.concat(this.advancedButtonGroups()); }
      return groups;
    }

    basicButtonGroups() {
      return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.basic);
    }

    intermediateButtonGroups() {
      return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.intermediate);
    }

    advancedButtonGroups() {
      return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.advanced);
    }

    handleCommandButton(latex) {
      this.performCommand(latex);
      return this.focus();
    }

    handleWriteButton(latex) {
      this.performWrite(latex);
      return this.focus();
    }

    performCommand(latex) {
      return this.mathfield.cmd(latex);
    }

    performWrite(latex) {
      return this.mathfield.write(latex);
    }

    focus() {
      this.find('textarea').focus();
    }

    equationLatex() {
      return this.mathfield.latex();
    }
  });
  Cls.initClass();
  return Cls;
})();

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

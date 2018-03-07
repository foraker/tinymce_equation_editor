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

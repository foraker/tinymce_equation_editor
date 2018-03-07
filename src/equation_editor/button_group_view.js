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

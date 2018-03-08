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

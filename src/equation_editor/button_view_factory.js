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

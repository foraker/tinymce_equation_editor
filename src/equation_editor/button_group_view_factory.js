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

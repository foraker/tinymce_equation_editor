EquationEditor.ButtonGroupViewFactory =
  create: (config) ->
    buttonGroups = []

    for buttonGroupConfig in config
      buttonGroupConfig.buttonViews = EquationEditor.ButtonViewFactory.create(buttonGroupConfig.buttonViews)
      buttonGroups.push(new EquationEditor.ButtonGroupView(buttonGroupConfig))

    buttonGroups

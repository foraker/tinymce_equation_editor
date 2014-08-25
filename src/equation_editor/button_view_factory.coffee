EquationEditor.ButtonViewFactory =
  create: (config) ->
    buttons = []

    for buttonConfig in config
      klass = eval(buttonConfig.klass)
      buttons.push(new klass(buttonConfig))

    buttons

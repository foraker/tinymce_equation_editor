Buttons = EquationEditor.Buttons
ButtonGroup = EquationEditor.ButtonGroupView

class EquationEditor.EquationEditorView extends EquationEditor.View
  initialize: ->
    @existingLatex = @options.existingLatex
    @restrictions  = @options.restrictions || {}
    EquationEditor.Events.on('latex:command', @handleCommandButton, @)
    EquationEditor.Events.on('latex:write', @handleWriteButton, @)

  render: ->
    $.getJSON('config.json').done (config) =>
      @config = config
      @addButtonBar()
      @addButtonGroups()
      @enableMathMagic()
    @

  enableMathMagic: ->
    @$('.math-button a').mathquill()
    @input().mathquill('editable')
    @input().mathquill('latex', @existingLatex) if @existingLatex?
    @focus()

  input: ->
    @$('.math')

  addButtonBar: ->
    for button in @buttonBarButtons()
      @$('.button-bar').append(button.render().$el)

  addButtonGroups: ->
    for buttonGroup in @buttonGroups()
      @$('.button-groups').append(buttonGroup.render().$el)

  buttonBarButtons: ->
    EquationEditor.ButtonViewFactory.create(@config.buttonBar)

  buttonGroups: ->
    groups = @basicButtonGroups()
    groups = groups.concat @intermediateButtonGroups() unless @restrictions.disallow_intermediate
    groups = groups.concat @advancedButtonGroups()     unless @restrictions.disallow_advanced
    groups

  basicButtonGroups: ->
    EquationEditor.ButtonGroupViewFactory.create(@config.buttonGroups.basic)

  intermediateButtonGroups: ->
    EquationEditor.ButtonGroupViewFactory.create(@config.buttonGroups.intermediate)

  advancedButtonGroups: ->
    EquationEditor.ButtonGroupViewFactory.create(@config.buttonGroups.advanced)

  handleCommandButton: (latex) =>
    @performCommand(latex)
    @focus()

  handleWriteButton: (latex) =>
    @performWrite(latex)
    @focus()

  performCommand: (latex) ->
    @input().mathquill('cmd', latex)

  performWrite: (latex) ->
    @input().mathquill('write', latex)

  focus: =>
    @$('textarea').focus()

  equationLatex: ->
    @input().mathquill('latex')

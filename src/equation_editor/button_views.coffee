EquationEditor.Buttons = {}

class EquationEditor.Buttons.BaseButtonView extends EquationEditor.View
  initialize: ->
    @latex      = @options.latex
    @buttonText = @options.buttonText
    @className  = @options.className || 'math-button'

  handleClick: (e) =>
    e.preventDefault()
    EquationEditor.Events.trigger "latex:#{@event}", @latex

  render: ->
    @createElement()
    @$('a').on 'click', @handleClick
    @

  template: ->
    """
    <div class="#{@className}">
      <a title="#{@buttonText}" href="#">#{@buttonText}</a>
    </div>
    """

class EquationEditor.Buttons.CommandButtonView extends EquationEditor.Buttons.BaseButtonView
  event: 'command'

class EquationEditor.Buttons.CharacterButtonView extends EquationEditor.Buttons.CommandButtonView
  initialize: ->
    @latex      = @options.character
    @buttonText = @options.character

class EquationEditor.Buttons.WriteButtonView extends EquationEditor.Buttons.BaseButtonView
  event: 'write'

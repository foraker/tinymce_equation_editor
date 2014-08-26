EquationEditor.Buttons = {}

class EquationEditor.Buttons.BaseButtonView extends EquationEditor.View
  initialize: ->
    @latex      = @options.latex
    @buttonText = @options.buttonText || @options.latex
    @className  = ['math-button', @options.className].join(' ').trim()

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

class EquationEditor.Buttons.WriteButtonView extends EquationEditor.Buttons.BaseButtonView
  event: 'write'

class EquationEditor.ButtonGroupView extends EquationEditor.View
  initialize: ->
    @groupName   = @options.groupName
    @buttonViews = @options.buttonViews

  render: ->
    @createElement()
    @renderButtons()
    new EquationEditor.CollapsibleView($el: @$el)
    @$('header').click @toggle
    @

  toggle: =>
    @$('.collapsible-box-toggle').click()

  renderButtons: ->
    for buttonView in @buttonViews
      @$('.buttons').append(buttonView.render().$el)

  template: ->
    """
    <div class="button-group collapsible">
      <a href='#' class='collapsible-box-toggle ss-dropdown'></a> <header>#{@groupName}</header>

      <div class="buttons box-content-collapsible hidden"></div>
    </div>
    """

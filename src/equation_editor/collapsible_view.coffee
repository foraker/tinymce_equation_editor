class EquationEditor.CollapsibleView extends EquationEditor.View
  initialize: ->
    @$('.collapsible-box-toggle').on('click', @toggleCollapse)

  toggleCollapse: (e) =>
    e.preventDefault()
    if @$('.box-content-collapsible').is(':visible')
      @closeCollapsible()
    else
      @openCollapsible()

  openCollapsible: ->
    @$('.box-content-collapsible').slideDown()
    @toggleOpenClass()

  closeCollapsible: ->
    @$('.box-content-collapsible').slideUp()
    @toggleOpenClass()

  toggleOpenClass: ->
    @$('.collapsible-box-toggle').toggleClass('collapsible-box-toggle-open')

class EquationEditor.View
  $: (selector) ->
    @$el.find(selector)

  constructor: (options) ->
    @options = options
    @$el = @options.$el or $(@options.el)
    @initialize.apply(@, arguments)

  initialize: ->

  createElement: ->
    @$el = $(@template())

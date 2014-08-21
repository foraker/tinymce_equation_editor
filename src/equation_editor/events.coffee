window.EquationEditor = {}

EquationEditor.Events =
  on: (name, callback, context) ->
    @_events ||= {}
    @_events[name] ||= []
    @_events[name].push(callback: callback, context: context || @)

  trigger: (name) ->
    return unless @_events
    args = Array.prototype.slice.call(arguments, 1)
    if (events = @_events[name])
      @triggerEvents(events, args)

  triggerEvents: (events, args) ->
    for event in events
      event.callback.call(event.context, args...)

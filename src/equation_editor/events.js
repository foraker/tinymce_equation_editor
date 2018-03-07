window.EquationEditor = {};

EquationEditor.Events = {
  on(name, callback, context) {
    if (!this._events) { this._events = {}; }
    if (!this._events[name]) { this._events[name] = []; }
    return this._events[name].push({callback, context: context || this});
  },

  trigger(name) {
    let events;
    if (!this._events) { return; }
    const args = Array.prototype.slice.call(arguments, 1);
    if (events = this._events[name]) {
      return this.triggerEvents(events, args);
    }
  },

  triggerEvents(events, args) {
    return Array.from(events).map((event) =>
      event.callback.call(event.context, ...Array.from(args)));
  }
};

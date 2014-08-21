Buttons = EquationEditor.Buttons
ButtonGroup = EquationEditor.ButtonGroupView

class EquationEditor.EquationEditorView extends EquationEditor.View
  initialize: ->
    @existingLatex = @options.existingLatex
    @restrictions  = @options.restrictions || {}
    EquationEditor.Events.on('latex:command', @handleCommandButton, @)
    EquationEditor.Events.on('latex:write', @handleWriteButton, @)

  render: ->
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
    [
      new Buttons.WriteButtonView(latex: '+', buttonText: '+'),
      new Buttons.WriteButtonView(latex: '-', buttonText: '-'),
      new Buttons.WriteButtonView(latex: '\\times', buttonText: '\\times'),
      new Buttons.WriteButtonView(latex: '\\div', buttonText: '\\div'),
      new Buttons.CommandButtonView(latex: '/', buttonText: 'x/y'),
      new Buttons.CommandButtonView(latex: '^', buttonText: 'y^x', className: 'math-button tall'),
      new Buttons.CommandButtonView(latex: '\\sqrt', buttonText: '\\sqrt{x}', className: 'math-button sqrt-button'),
      new Buttons.WriteButtonView(latex: '=', buttonText: '='),
      new Buttons.WriteButtonView(latex: '\\approx', buttonText: '\\approx')
    ]

  buttonGroups: ->
    groups = @basicButtonGroups()
    groups = groups.concat @intermediateButtonGroups() unless @restrictions.disallow_intermediate
    groups = groups.concat @advancedButtonGroups()     unless @restrictions.disallow_advanced
    groups

  basicButtonGroups: ->
    [
      new ButtonGroup(groupName: 'Numbers', buttonViews: [
        new Buttons.CommandButtonView(latex: '0', buttonText: '0'),
        new Buttons.CommandButtonView(latex: '1', buttonText: '1'),
        new Buttons.CommandButtonView(latex: '2', buttonText: '2'),
        new Buttons.CommandButtonView(latex: '3', buttonText: '3'),
        new Buttons.CommandButtonView(latex: '4', buttonText: '4'),
        new Buttons.CommandButtonView(latex: '5', buttonText: '5'),
        new Buttons.CommandButtonView(latex: '6', buttonText: '6'),
        new Buttons.CommandButtonView(latex: '7', buttonText: '7'),
        new Buttons.CommandButtonView(latex: '8', buttonText: '8'),
        new Buttons.CommandButtonView(latex: '9', buttonText: '9'),
        new Buttons.CommandButtonView(latex: ',', buttonText: ','),
        new Buttons.CommandButtonView(latex: '.', buttonText: '.'),
        new Buttons.CommandButtonView(latex: '\\pi', buttonText: '\\pi'),
        new Buttons.CommandButtonView(latex: 'i', buttonText: 'i'),
        new Buttons.CommandButtonView(latex: 'e', buttonText: 'e'),
        new Buttons.CommandButtonView(latex: '\\infty', buttonText: '\\infty')
      ]),
      new ButtonGroup(groupName: 'Arithmetic and Units', buttonViews: [
        new Buttons.WriteButtonView(latex: '+', buttonText: '+'),
        new Buttons.WriteButtonView(latex: '-', buttonText: '-'),
        new Buttons.WriteButtonView(latex: '\\times', buttonText: '\\times'),
        new Buttons.WriteButtonView(latex: '\\div', buttonText: '\\div'),
        new Buttons.WriteButtonView(latex: '\\pm', buttonText: '\\pm'),
        new Buttons.CommandButtonView(latex: '\\overline', buttonText: '\\overline{x}'),
        new Buttons.WriteButtonView(latex: '\\cdot', buttonText: '\\cdot'),
        new Buttons.CommandButtonView(latex: '/', buttonText: '/'),
        new Buttons.WriteButtonView(latex: '$', buttonText: '$')
        new Buttons.WriteButtonView(latex: '\\degree', buttonText: '\\degree'),
        new Buttons.WriteButtonView(latex: '%', buttonText: '%'),
      ])
    ]

  intermediateButtonGroups: ->
    [
      new ButtonGroup(groupName: 'Exponents, Roots, Logs', buttonViews: [
        new Buttons.CommandButtonView(latex: '^', buttonText: 'y^x', className: 'math-button tall'),
        new Buttons.CommandButtonView(latex: '\\sqrt', buttonText: '\\sqrt{x}', className: 'math-button sqrt-button'),
        new Buttons.CommandButtonView(latex: '\\thirdroot', buttonText: '\\nthroot[3]{x}', className: 'math-button sqrt-button tall'),
        new Buttons.CommandButtonView(latex: '\\nthroot', buttonText: '\\nthroot[n]{x}', className: 'math-button sqrt-button tall'),
        new Buttons.WriteButtonView(latex: 'e^x', buttonText: 'e^x', className: 'math-button tall'),
        new Buttons.WriteButtonView(latex: '\\ln', buttonText: '\\ln'),
        new Buttons.WriteButtonView(latex: '\\log', buttonText: '\\log'),
        new Buttons.WriteButtonView(latex: '\\log_b', buttonText: '\\log_b'),
      ]),
      new ButtonGroup(groupName: 'Relations', buttonViews: [
        new Buttons.WriteButtonView(latex: '=', buttonText: '='),
        new Buttons.WriteButtonView(latex: '\\neq', buttonText: '\\neq'),
        new Buttons.WriteButtonView(latex: '\\sim', buttonText: '\\sim'),
        new Buttons.WriteButtonView(latex: '\\not\\sim', buttonText: '\\not\\sim'),
        new Buttons.WriteButtonView(latex: '\\lt', buttonText: '\\lt'),
        new Buttons.WriteButtonView(latex: '\\gt', buttonText: '\\gt'),
        new Buttons.WriteButtonView(latex: '\\approx', buttonText: '\\approx'),
        new Buttons.WriteButtonView(latex: '\\not\\approx', buttonText: '\\not\\approx'),
        new Buttons.WriteButtonView(latex: '\\le', buttonText: '\\le'),
        new Buttons.WriteButtonView(latex: '\\ge', buttonText: '\\ge'),
        new Buttons.WriteButtonView(latex: '\\simeq', buttonText: '\\simeq'),
        new Buttons.WriteButtonView(latex: '\\not\\simeq', buttonText: '\\not\\simeq'),
        new Buttons.WriteButtonView(latex: '\\therefore', buttonText: '\\therefore'),
      ]),
      new ButtonGroup(groupName: 'Geometry', buttonViews: [
        new Buttons.WriteButtonView(latex: '\\rightarrow', buttonText: '\\rightarrow'),
        new Buttons.WriteButtonView(latex: '\\leftrightarrow', buttonText: '\\leftrightarrow'),
        new Buttons.CommandButtonView(latex: '\\overline', buttonText: '\\overline{AB}'),
        new Buttons.CommandButtonView(latex: '\\overarc', buttonText: '\\overarc{AB}'),
        new Buttons.WriteButtonView(latex: '\\parallel', buttonText: '\\parallel'),
        new Buttons.WriteButtonView(latex: '\\perp', buttonText: '\\perp'),
        new Buttons.WriteButtonView(latex: '\\angle', buttonText: '\\angle'),
        new Buttons.WriteButtonView(latex: 'm\\angle', buttonText: 'm\\angle'),
        new Buttons.WriteButtonView(latex: '\\bigtriangleup', buttonText: '\\bigtriangleup'),
        new Buttons.WriteButtonView(latex: '▱', buttonText: '▱'),
        new Buttons.WriteButtonView(latex: '\\bigodot', buttonText: '\\bigodot')
      ]),
      new ButtonGroup(groupName: 'Groups', buttonViews: [
        new Buttons.CommandButtonView(latex: '(', buttonText: '(\\cdot)'),
        new Buttons.CommandButtonView(latex: '[', buttonText: '[\\cdot]'),
        new Buttons.CommandButtonView(latex: '|', buttonText: '|\\cdot|'),
        new Buttons.WriteButtonView(latex: '(x,y)', buttonText: '(x,y)'),
        new Buttons.WriteButtonView(latex: '[x,y]', buttonText: '[x,y]'),
        new Buttons.WriteButtonView(latex: '(x,y]', buttonText: '(x,y]'),
        new Buttons.WriteButtonView(latex: '[x,y)', buttonText: '[x,y)'),
      ])
    ]

  advancedButtonGroups: ->
    [
      new ButtonGroup(groupName: 'Trigonometry', buttonViews: [
        new Buttons.CommandButtonView(latex: '\\sin', buttonText: '\\sin'),
        new Buttons.WriteButtonView(latex: '\\sec', buttonText: '\\sec'),
        new Buttons.WriteButtonView(latex: '\\sin^{-1}', buttonText: '\\sin^{-1}', className: 'math-button small-exponent'),
        new Buttons.WriteButtonView(latex: '\\sec^{-1}', buttonText: '\\sec^{-1}', className: 'math-button small-exponent'),
        new Buttons.WriteButtonView(latex: '\\cos', buttonText: '\\cos'),
        new Buttons.WriteButtonView(latex: '\\csc', buttonText: '\\csc'),
        new Buttons.WriteButtonView(latex: '\\cos^{-1}', buttonText: '\\cos^{-1}', className: 'math-button small-exponent'),
        new Buttons.WriteButtonView(latex: '\\csc^{-1}', buttonText: '\\csc^{-1}', className: 'math-button small-exponent'),
        new Buttons.WriteButtonView(latex: '\\tan', buttonText: '\\tan'),
        new Buttons.WriteButtonView(latex: '\\cot', buttonText: '\\cot'),
        new Buttons.WriteButtonView(latex: '\\tan^{-1}', buttonText: '\\tan^{-1}', className: 'math-button small-exponent'),
        new Buttons.WriteButtonView(latex: '\\cot^{-1}', buttonText: '\\cot^{-1}', className: 'math-button small-exponent')
      ]),
      new ButtonGroup(groupName: 'Statistics', buttonViews: [
        new Buttons.WriteButtonView(latex: '\\mu', buttonText: '\\mu'),
        new Buttons.WriteButtonView(latex: '\\sigma', buttonText: '\\sigma'),
        new Buttons.WriteButtonView(latex: '\\overline{x}', buttonText: '\\overline{x}'),
        new Buttons.WriteButtonView(latex: '\\overline{y}', buttonText: '\\overline{y}'),
        new Buttons.WriteButtonView(latex: 'x^i', buttonText: 'x^i'),
        new Buttons.WriteButtonView(latex: 'x_i', buttonText: 'x_i'),
        new Buttons.WriteButtonView(latex: 'x!', buttonText: 'x!'),
        new Buttons.WriteButtonView(latex: '\\Sigma', buttonText: '\\Sigma')
      ]),
      new ButtonGroup(groupName: 'Greek', buttonViews: [
        new Buttons.WriteButtonView(latex: '\\alpha', buttonText: '\\alpha'),
        new Buttons.WriteButtonView(latex: '\\beta', buttonText: '\\beta'),
        new Buttons.WriteButtonView(latex: '\\gamma', buttonText: '\\gamma'),
        new Buttons.WriteButtonView(latex: '\\delta', buttonText: '\\delta'),
        new Buttons.WriteButtonView(latex: '\\theta', buttonText: '\\theta'),
        new Buttons.WriteButtonView(latex: '\\pi', buttonText: '\\pi')
      ]),
      new ButtonGroup(groupName: 'Calculus', buttonViews: [
        new Buttons.CommandButtonView(latex: '\\int', buttonText: '\\int'),
        new Buttons.WriteButtonView(latex: '\\int_{a}^{b}', buttonText: '\\int_{a}^{b}', className: 'math-button integral tall'),
        new Buttons.WriteButtonView(latex: 'dx', buttonText: 'dx'),
        new Buttons.WriteButtonView(latex: '\\frac{d}{dx}', buttonText: '\\frac{d}{dx}', className: 'math-button tall'),
        new Buttons.WriteButtonView(latex: '\\lim_{x \\to \\infty}', buttonText: '\\lim'),
        new Buttons.WriteButtonView(latex: '\\sum_{i=1}^{n}', buttonText: '\\sum'),
        new Buttons.WriteButtonView(latex: '\\infty', buttonText: '\\infty')
      ])
    ]

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

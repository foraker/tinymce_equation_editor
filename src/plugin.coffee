tinymce.create('tinymce.plugins.EquationEditorPlugin', {
  init: (editor, url) ->
    latexImgRendererUrl = 'http://chart.apis.google.com/chart?cht=tx&chl='
    editing = null

    editor.addCommand 'mceMathquill', (existing_latex) ->
      existing_latex ||= ''

      popup = editor.windowManager.open(
        {
          url: '/equation_editor/equation_editor.html'
          width: 820,
          height: 400,
          inline: 1,
          popup_css: false,
          title: 'Equation Editor',
          buttons: [
            {
              text: 'insert',
              subtype: 'primary',
              onclick: ->
                win = editor.windowManager.getWindows()[0]
                latex = editor.windowManager.getParams()['latexInput'].mathquill('latex')

                editor.execCommand 'mceMathquillInsert', latex
                win.close()
            },
            {
              text: 'cancel',
              onclick: ->
                editing = null
                editor.windowManager.getWindows()[0].close()
            }
          ]
        },
        {
          plugin_url: url,
          existing_latex: existing_latex,
        }
      )

    editor.addCommand 'mceMathquillInsert', (latex) ->
      return unless latex

      content = """
        &nbsp;<span class="rendered-latex" contenteditable="false">
          #{latex}
        </span>&nbsp;
      """

      editor.selection.select(editing) if editing
      editing = null

      editor.selection.setContent(content)

    editor.on 'init', ->
      $(editor.getDoc()).on 'click', '.rendered-latex', (e) ->
        e.stopPropagation()
        editing = @
        latex = $(@).find('.selectable').text().replace(/^\$/, '').replace(/\$$/, '')
        editor.execCommand('mceMathquill', latex)

    editor.addButton 'equationeditor', {
      title: 'Equation editor',
      cmd: 'mceMathquill',
      text: 'f(x)'
    }

    # Use mathquill-rendered-latex when getting the contents of the document
    editor.on 'preProcess', (ed) ->
      mathquills = ed.target.dom.select('.rendered-latex:not(.mathquill-rendered-math)')
      $(mathquills).mathquill()

    # When loading or setting content, render the Mathquill
    editor.on 'loadContent', (ed) ->
      mathquills = ed.target.dom.select('span.rendered-latex:not(.mathquill-rendered-math)')
      $(mathquills).mathquill()

    editor.on 'setContent', (ed) ->
      mathquills = ed.target.dom.select('span.rendered-latex:not(.mathquill-rendered-math)')
      $(mathquills).mathquill()
  ,

  getInfo : ->
    {
      longname:  'Equation Editor',
      author:    'Foraker, derived from https://github.com/laughinghan/tinymce_mathquill_plugin',
      authorurl: 'http://www.foraker.com',
      infourl:   'https://github.com/foraker/tinymce_equation_editor',
      version:   '1.0'
    }
})
tinymce.PluginManager.add('equationeditor', tinymce.plugins.EquationEditorPlugin)

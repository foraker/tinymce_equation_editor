tinymce.create('tinymce.plugins.EquationEditorPlugin', {
  init(editor, url) {
    let editing = null;
    function clean(s) {
      if (!s) {
        return '';
      }
      return s.replace(/^\$+/, '').replace(/\$+$/, '');
    }

    const MQ = MathQuill.getInterface(2);

    editor.addCommand('mceMathquill', function(existing_latex) {
      let popup;
      if (!existing_latex) { existing_latex = ''; }

      return popup = editor.windowManager.open(
        {
          url: 'equation_editor.html',
          width: 820,
          height: 400,
          inline: 1,
          popup_css: false,
          title: 'Equation Editor',
          buttons: [
            {
              text: 'insert',
              subtype: 'primary',
              onclick() {
                const win = editor.windowManager.getWindows()[0];
                const latex = editor.windowManager.getParams()['latexInput'].mathfield.latex();

                editor.execCommand('mceMathquillInsert', latex);
                return win.close();
              }
            },
            {
              text: 'cancel',
              onclick() {
                editing = null;
                return editor.windowManager.getWindows()[0].close();
              }
            }
          ]
        },
        {
          plugin_url: url,
          existing_latex,
        }
      );
    });

    editor.addCommand('mceMathquillInsert', function(latex) {
      if (!latex) { return; }

      const content = `<span class="mathlatex">${latex}</span>`;

      if (editing) {
        editor.selection.select(editing);
      }
      editing = null;

      return editor.selection.setContent(content);
    });

    editor.on('init', () => {
      // Chrome on android rarely fires the click event but always the touchend.
      $(editor.getDoc()).on('touchend', 'span.mathlatex', function (e) {
        e.stopPropagation();
        editing = this;
        const latex = clean($(this).find('.mq-selectable').text());
        return editor.execCommand('mceMathquill', latex);
      });

      $(editor.getDoc()).on('click', 'span.mathlatex', function(e) {
        e.stopPropagation();
        editing = this;
        const latex = clean($(this).find('.mq-selectable').text());
        return editor.execCommand('mceMathquill', latex);
      });
    }
    );

    editor.addButton('equationeditor', {
      title: 'Equation editor',
      cmd: 'mceMathquill',
      text: 'f(x)'
    });

    // Use mathquill-rendered-latex when getting the contents of the document
    editor.on('preProcess', function(ed) {
      const mathquills = ed.target.dom.select('span.mathlatex');
      if (mathquills.length > 0) {
        let result = [];
        for (let i = 0; i < mathquills.length; i++) {
          let math = mathquills[i].querySelector('.mq-selectable');
          if (math) {
            mathquills[i].innerHTML = '$$'+clean(math.innerHTML)+'$$';
          }
        }
      }
    });

    // When loading or setting content, render the Mathquill
    editor.on('loadContent', function(ed) {
      const mathquills = ed.target.dom.select('span.mathlatex');
      if (mathquills.length > 0) {
        return __range__(0, mathquills.length, true).map((i) =>
          MQ.StaticMath(mathquills[i]));
      }
    });

    return editor.on('setContent', function(ed) {
      if (ed.target.selection.getNode().nodeName === 'BODY') {
        // The entire body is being replaced and we don't know if formulas are in the $$ format.
        // Or surrounded by <span class="mathlatex">$$x+5</span>.
        let formulas = ed.content.replace(/<span class="mathlatex(.*?)">\$\$(.*?)\$\$<\/span>/g, '$$$$$2$$$$');
        // Convert $$ delimeted latex into <span class="mathlatex">x+1</span> elements.
        // Test string "<p>this should be ingored</p><p>this too $$ and this</p>
        // <p>And this should match $$x+4=4$$</p>
        // <p>This too 3 $$ is how you use<span>the $$ chars</span></p>"
        // <p>To use double dollar signs making them bold like <b>$$</b> will allow them to be ignored</p>
        formulas = formulas.replace(/\$\$(.*?)(\$\$|<\/[a-z]|<[a-z]+>)/g,
          function (match) {
            if (match.match(/^\$\$(.*)\$\$$/)) {
              // This starts and stops with a $$ so it looks like a formula.
              return match.replace(/\$\$(.*?)(\$\$|<\/[a-z]|<[a-z]+>)/g, '<span class="mathlatex">$1</span>');
            } else {
              // This ends with a tag and is not likely a function.
              // One potential match would be <x>.
              return match;
            }
          });
          ed.target.selection.getNode().innerHTML = formulas;
      }
      const mathquills = ed.target.dom.select('span.mathlatex');
      if (mathquills.length > 0) {
        let result = [];
        for (let i = 0; i < mathquills.length; i++) {
          result[i] = MQ.StaticMath(mathquills[i]);
        }
        return result;
      }
    });
  }
  ,

  getInfo() {
    return {
      longname:  'Equation Editor',
      author:    'Foraker, derived from https://github.com/laughinghan/tinymce_mathquill_plugin',
      authorurl: 'http://www.foraker.com',
      infourl:   'https://github.com/foraker/tinymce_equation_editor',
      version:   '1.0'
    };
  }
});
tinymce.PluginManager.add('equationeditor', tinymce.plugins.EquationEditorPlugin);

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
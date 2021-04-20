<template>
  <div class="md-component">
    <div id="article-editor">
      <textarea onpropertychange="change" style="display:none;"></textarea>
    </div>
    <!-- <script type="text/javascript">
      $(function() {
        var editor = editormd("test-editor", {
          width  : "100%",
          height : "100%",
          path   : "editormd/lib/",
          watch                : false,
          toolbarIcons : function() {
            // Or return editormd.toolbarModes[name]; // full, simple, mini
            // Using "||" set icons align right.
            return [
              "bold", "del", "italic", "quote", "|",
              "list-ul", "list-ol", "hr", "|",
              "link", "image", "code", "code-block", "table", "datetime", "html-entities", "|",
              "||", "watch", "preview", "fullscreen"
            ]
          },
          onchange: function() {
            console.log('onchange1')
          }
        });
      });
    </script> -->
    <!-- <script>
    function change () {
      console.log('onchange1')
    }
    </script> -->
  </div>
</template>

<script>
// https://github.com/pandao/editor.md
export default {
  props: {
    content: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      editorValue: ''
    }
  },
  watch: {
    content: function(newVal) {
      this.editorValue = newVal
      this.initMD()
    }
  },
  mounted() {
    console.log('mounted')
    this.editorValue = this.content
    if (!this.editorValue) {
      const draft = localStorage.getItem('articleDraft')
      if (draft) {
        this.editorValue = draft
      }
    }
    this.$nextTick(() => {
      this.initMD()
    })
  },
  methods: {
    initMD() {
      editormd('article-editor', {
        value: this.editorValue,
        width: '100%',
        height: '100%',
        path: 'editormd/lib/',
        watch: false,
        placeholder: '支持 markdown 语法。',
        toolbarIcons: function() {
          // Or return editormd.toolbarModes[name]; // full, simple, mini
          // Using "||" set icons align right.
          return [
            'bold', 'del', 'italic', 'quote', '|',
            'list-ul', 'list-ol', 'hr', '|',
            'link', 'image', 'code', 'code-block', 'table', 'datetime', 'html-entities', '|',
            '||', 'watch', 'preview', 'fullscreen'
          ]
        },
        oninput: (value) => {
          this.$emit('change', value)
          localStorage.setItem('articleDraft', value)
        }
      })
    },
    change() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss">
.md-component{
  line-height: 1;
  height: 400px;
  .editormd{
    border-radius: 4px;
  }
  .editormd-fullscreen{
    z-index: 6000;
  }
}
</style>

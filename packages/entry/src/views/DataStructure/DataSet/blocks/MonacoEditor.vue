<template>
  <div class="monaco-editor" ref="sqlContainerSelf"></div>
</template>
<script setup>
import * as monaco from 'monaco-editor'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watchEffect } from 'vue'

const props = defineProps({
  code: {
    type: String
  }
})
const sqlContainerSelf = ref(null)
let editorInstance = null //编辑器实例
const emit = defineEmits(['update:code', 'editorInstanceReady'])
const code = computed({
  get: () => props.code,
  set: (val) => emit('update:code', val)
})

onMounted(() => {
  watchEffect(() => {
    if (sqlContainerSelf.value) {
      nextTick(() => {
        if (editorInstance) {
          editorInstance.dispose()
        }
        monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems: (model, position) => {
            // console.log(model,position);
            let suggestions = []
            const { lineNumber, column } = position
            const textBeforePointer = model.getValueInRange({
              startLineNumber: lineNumber,
              startColumn: 0,
              endLineNumber: lineNumber,
              endColumn: column
            })
            const contents = textBeforePointer.trim().split(/\s+/)
            const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
            if (lastContents) {
              const sqlConfigKey = ['builtinFunctions', 'keywords', 'operators']
              sqlConfigKey.forEach((key) => {
                sqlLanguage[key].forEach((sql) => {
                  suggestions.push({
                    label: sql, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
                    kind: monaco.languages.CompletionItemKind.Function, // 设置补全项的 kind 属性
                    insertText: sql // 选择此完成时应插入到文档中的字符串或片段
                  })
                })
              })
            }
            return {
              suggestions
            }
          }
        })
        editorInstance = monaco.editor.create(sqlContainerSelf.value, {
          value: code.value,
          language: 'sql',
          theme: 'vs',
          automaticLayout: true, //自适应
          glyphMargin: true, //字形边缘
          autoIndex: true, //开启自动索引
          cursorSurroundingLinesStyle: 'all', //光标环绕样式
          colorDecorators: true, // 呈现内联色彩装饰器和颜色选择器
          accessibilitySupport: 'off', //辅助功能支持
          wordWrap: 'on' // 开启自动换行
        })

        emit('editorInstanceReady', editorInstance, monaco.editor)
      })
    }
  })
})

onBeforeUnmount(() => {
  if (editorInstance) {
    // 组件卸载前销毁编辑器实例
    editorInstance.dispose()
  }
})
</script>
<style lang="scss" scoped>
.monaco-editor {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="bg-purple preview-result">
      {{previewResult}}
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TOOL_NAME from '../const/tool-name';
import formatParser from '../utils/format-parser';
/**
 * 预览翻译
 */
export default {
  name: 'trans-item-preview',
  props: {
    tools: {
      type: Array,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      availableLocales: 'availableLocales',
    }),
    isLocaleEN() {
      return this.locale === this.availableLocales.en;
    },
    previewResult() {
      return this.tools.reduce((result, tool) => {
        let preResult = result;
        switch (tool.component) {
          case TOOL_NAME.PLAIN_TEXT_TOOL:
            preResult += tool.value.plainText;
            break;
          case TOOL_NAME.VARIABLE_TOOL:
            preResult += 'xx';
            break;
          case TOOL_NAME.PLURAL_TOOL:
            preResult += formatParser.pluralPreview({ other: tool.value.other }, this.isLocaleEN);
            break;
          default:
            break;
        }
        return preResult;
      }, '');
    },
  },
};
</script>

<style scoped>
.preview-result {
  color: #67c23a;
}
</style>

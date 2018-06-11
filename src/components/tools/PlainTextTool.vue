<template>
  <span>
    <el-input
      type="textarea"
      autosize
      :disabled="readonly"
      @change="update"
      v-model="plainText">
    </el-input>
  </span>
</template>

<script>
import TOOL_NAME from '../../const/tool-name';
import composeTextUtil from '../../utils/compose-text-util';

export default {
  name: TOOL_NAME.PLAIN_TEXT_TOOL,
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    const { plainText, readonly } = this.value;

    return {
      plainText,
      readonly,
    };
  },
  computed: {
    composeText() {
      return composeTextUtil.plainTextTool(this.plainText);
    },
  },
  watch: {
    value(newVal) {
      const { plainText, readonly } = newVal;
      this.plainText = plainText;
      this.readonly = readonly;
    },
  },
  methods: {
    update() {
      this.$emit('update', {
        plainText: this.plainText,
        composeText: this.composeText,
      });
    },
  },
};
</script>

<style scoped>
</style>

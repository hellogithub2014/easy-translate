<template>
  <span>
    <el-input type="textarea" autosize  :disabled="readonly"  @change="update" v-model="plainText"></el-input>
  </span>
</template>

<script>
import TOOL_NAME from '../../const/tool-name';

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
        composeText: this.plainText,
      });
    },
  },
};
</script>

<style scoped>
</style>

<template>
  <span>
    <el-input type="textarea" autosize  @change="update" v-model="plainText"></el-input>
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
    const { plainText } = this.value;

    return {
      plainText,
    };
  },
  watch: {
    value(newVal) {
      const { plainText } = newVal;
      this.plainText = plainText;
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

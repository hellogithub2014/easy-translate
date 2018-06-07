<template>
  <span>
    <el-input type="textarea" autosize v-model="plainText"></el-input>
  </span>
</template>

<script>
export default {
  name: 'plain-text-tool',
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
};
</script>

<style scoped>
</style>

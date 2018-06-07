<template>
  <span class="view" @click="$emit('clicThumb')">
    {{text}}
  </span>
</template>

<script>
export default {
  name: 'thumb-view',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.view {
  display: inline-block;
  border: 1px solid red;
  border-radius: 2px;
}
</style>

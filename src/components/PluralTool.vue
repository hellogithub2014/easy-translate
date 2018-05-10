<template>
  <span>
    <el-button type="primary" @click="showDialog = true">单复数</el-button>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
    >
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="showDialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'plural-tool',
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    confirm() {
      this.showDialog = false;
      this.$emit('confirm');
    },
  },
};
</script>

<style scoped>

</style>

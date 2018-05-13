<template>
  <span>
    <el-button type="danger" @click="showDialog=true;" round>
      <i class="el-icon-check"></i>
      发布
    </el-button>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%">
      <span>确认发布？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false;">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'publish-transtion',
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    confirm() {
      this.showDialog = false;
    },
  },
};
</script>

<style scoped>

</style>

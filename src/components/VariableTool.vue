<template>
  <span>
    <el-button type="primary" @click="showDialog = true">插值</el-button>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
    >
      <el-form :model="form" :inline="true">
        <el-form-item label="插值字段名:">
          <el-input v-model="form.variableName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="showDialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'variable-tool',
  data() {
    return {
      showDialog: false,
      form: {
        variableName: '',
      },
    };
  },
  methods: {
    confirm() {
      this.showDialog = false;
      const { variableName } = this.form;
      if (variableName.trim()) {
        this.$emit('confirm', { variableName });
      }
    },
  },
};
</script>

<style scoped>

</style>

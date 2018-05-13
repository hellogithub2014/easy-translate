<template>
  <span>
    <el-button type="primary" @click="showDialog = true">插值</el-button>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
    >
      <el-form ref="variableForm" :model="formModel"  :inline="true">
        <el-form-item label="插值字段名:">
          <el-input v-model="formModel.variableName" auto-complete="off"></el-input>
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
      formModel: {
        variableName: '',
      },
    };
  },
  methods: {
    confirm() {
      const variableForm = this.$refs.variableForm;
      const { variableName } = this.formModel;

      this.showDialog = false;
      this.formModel.variableName = ''; // 重置
      variableForm.resetFields();

      if (variableName.trim()) {
        this.$emit('confirm', { variableName });
      }
    },
  },
};
</script>

<style scoped>

</style>

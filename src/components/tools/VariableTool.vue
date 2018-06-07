<template>
  <span>

    <!-- 弹窗隐藏时显示缩略图 -->
    <thumb-view :text="formModel.variableName" @clicThumb="showDialog = true"></thumb-view>

    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form ref="variableForm" :model="formModel"  :inline="true">
        <el-form-item label="插值字段名:">
          <el-input v-model.trim="formModel.variableName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="showDialog-footer">
        <el-button @click="tryCancelAddTool">取 消</el-button>
        <el-button type="primary"  :disabled="isVariableEmpty" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import ThumbView from './ThumbView';

export default {
  name: 'variable-tool',
  components: {
    ThumbView,
  },
  props: {
    value: {
      type: Object,
      reuqired: true,
    },
  },
  data() {
    const { showDialog = false, variableName = '', isNew = false } = this.value;

    return {
      showDialog,
      formModel: {
        variableName,
      },
      isNew,
    };
  },
  computed: {
    isVariableEmpty() {
      return !this.formModel.variableName;
    },
  },
  watch: {
    value(newVal) {
      const { showDialog = false, variableName = '', isNew = false } = newVal;
      this.showDialog = showDialog;
      this.formModel.variableName = variableName;
      this.isNew = isNew;
    },
  },
  methods: {
    confirm() {
      this.isNew = false;
      this.showDialog = false;
    },
    tryCancelAddTool() {
      this.showDialog = false;
      if (this.isNew) {
        this.$emit('cancel');
      }
    },
  },
};
</script>

<style scoped>
</style>

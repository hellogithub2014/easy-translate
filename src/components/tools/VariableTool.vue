<template>
  <span>

    <!-- 弹窗隐藏时显示缩略图 -->
    <thumb-view :text="composeText" @clicThumb="showDialog = true"></thumb-view>

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
import TOOL_NAME from '../../const/tool-name';

export default {
  name: TOOL_NAME.VARIABLE_TOOL,
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
    composeText() {
      return `{${this.formModel.variableName}}`;
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
      const { composeText, formModel } = this;
      this.showDialog = false;

      const eventParam = {
        ...this.$data,
        ...formModel,
        composeText,
      };

      if (this.isNew) {
        this.$emit('add', eventParam);
        this.isNew = false;
      } else {
        this.$emit('update', eventParam);
      }
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

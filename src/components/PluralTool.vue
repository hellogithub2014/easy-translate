<template>
  <span>
    <el-button type="primary" @click="showDialog = true">单复数</el-button>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
    >
      <el-form ref="pluralForm" :model="formModel"  :inline="true">
        <el-form-item label="字段名(必填):">
          <el-input v-model="formModel.plural" auto-complete="off" required></el-input>
        </el-form-item>
        <el-form-item label="值为0时显示:">
          <el-input v-model="formModel.zero" auto-complete="off"></el-input>
        </el-form-item>
        <!-- TODO: 中文、日文下此项隐藏 -->
        <el-form-item :label="labelOfPluralOne">
          <el-input v-model="formModel.one" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 必选 -->
        <el-form-item label="其他情况下显示(必填):">
          <el-input v-model="formModel.other" auto-complete="off" required></el-input>
          <p>在此项中使用 <strong>#</strong> 代表真正的值。 如 "# messages"在字段值为3时会被翻译为 "3 messages"</p>
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
import { mapState } from 'vuex';

export default {
  name: 'plural-tool',
  data() {
    return {
      showDialog: false,
      formModel: {
        plural: '',
        zero: '',
        one: '',
        other: '',
      },
    };
  },
  computed: {
    ...mapState({
      toLocale: 'toLocale',
    }),
    labelOfPluralOne() {
      const prefix = '值为1时显示';
      const suffix = ':';
      const tips = '(可选)';
      return prefix + (this.toLocale !== 'zh' ? tips : '') + suffix;
    },
  },
  methods: {
    confirm() {
      const pluralForm = this.$refs.pluralForm;
      const { plural, zero, one, other } = this.formModel;
      this.showDialog = false;

      this.clearFormModel(); // 重置
      pluralForm.resetFields();

      if (plural.trim() && other.trim()) {
        this.$emit('confirm', { plural, zero, one, other });
      }
    },
    clearFormModel() {
      const { formModel } = this;
      formModel.plural = '';
      formModel.zero = '';
      formModel.one = '';
      formModel.other = '';
    },
  },
};
</script>

<style scoped>

</style>

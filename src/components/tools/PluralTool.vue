<template>
  <span>

    <!-- 弹窗隐藏时显示缩略图 -->
    <thumb-view :text="thumbViewText" @clicThumb="showDialog = true"></thumb-view>


    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form ref="pluralForm" :model="formModel"  :inline="true">
        <el-form-item label="字段名(必填):">
          <el-input
            :disabled="readonly"
            v-model="formModel.plural"
            auto-complete="off"
            required>
          </el-input>
        </el-form-item>
        <!-- other是必须滴。 中文环境下，不需要one的选项，因为one和other显示时没有区别.
          不同环境下使用不用plural参见：http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html -->
        <el-form-item label="值为0时显示:">
          <el-input :disabled="readonly" v-model="formModel.zero" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="labelOfPluralOne" v-show="showPluralOne">
          <el-input :disabled="readonly" v-model="formModel.one" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 必选 -->
        <el-form-item label="其他情况下显示(必填):">
          <el-input
            :disabled="readonly"
            v-model="formModel.other"
            auto-complete="off"
            required>
          </el-input>
          <p>在此项中使用 <strong>#</strong> 代表真正的值。 如 "# messages"在字段值为3时会被翻译为 "3 messages"</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="showDialog-footer">
        <el-button @click="tryCancelAddTool">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!(readonly || isPluralValid)"
          @click="confirm">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { mapState } from 'vuex';
import ThumbView from './ThumbView';
import TOOL_NAME from '../../const/tool-name';
import composeTextUtil from '../../utils/compose-text-util';
import formatParser from '../../utils/format-parser';

export default {
  name: TOOL_NAME.PLURAL_TOOL,
  components: {
    ThumbView,
  },
  props: {
    value: {
      type: Object,
      reuqired: true,
    },
    locale: {
      type: String,
      required: true,
    },
  },
  data() {
    const {
      showDialog = false,
      plural = '',
      zero = '',
      one = '',
      other = '',
      isNew = false,
      readonly,
    } = this.value;

    return {
      showDialog,
      formModel: {
        plural,
        zero,
        one,
        other,
      },
      isNew,
      readonly,
    };
  },
  computed: {
    ...mapState({
      availableLocales: 'availableLocales',
    }),
    labelOfPluralOne() {
      const prefix = '值为1时显示';
      const suffix = ':';
      const tips = '(可选)';
      return prefix + (this.showPluralOne ? tips : '') + suffix;
    },
    showPluralOne() {
      // 只在英文下显示,中文、日文下没有此项
      return this.locale === this.availableLocales.en;
    },
    thumbViewText() {
      const { other } = this.formModel;
      return formatParser.pluralPreview({ other }, this.showPluralOne);
    },
    isPluralValid() {
      const { plural, zero, one, other } = this.formModel;

      return !(!plural || !zero || !other || (this.showPluralOne && !one));
    },
    composeText() {
      const { plural, zero, one, other } = this.formModel;
      return composeTextUtil.pluralTool({ plural, zero, one, other });
    },
  },
  watch: {
    value(newVal) {
      const {
        showDialog = false,
        plural = '',
        zero = '',
        one = '',
        other = '',
        isNew = false,
        readonly,
      } = newVal;
      this.showDialog = showDialog;
      this.formModel.plural = plural;
      this.formModel.zero = zero;
      this.formModel.one = one;
      this.formModel.other = other;
      this.isNew = isNew;
      this.readonly = readonly;
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
        this.isNew = false;
        eventParam.isNew = false;
        this.$emit('add', eventParam);
      } else {
        this.$emit('update', eventParam);
      }
    },
    tryCancelAddTool() {
      this.showDialog = false;
      if (this.isNew) {
        // 取消当前tool
        this.$emit('cancel');
      } else {
        // 重置为刚进来时的状态
        const { plural, zero, one, other } = this.value;
        this.formModel = Object.assign({}, this.formModel, {
          plural,
          zero,
          one,
          other,
        });
      }
    },
  },
};
</script>

<style scoped>
</style>

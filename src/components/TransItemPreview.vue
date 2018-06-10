<template>
  <div>
      <!-- 参数区域 -->
      <el-row v-for="(param,index) in previewParamList" :key="index" :gutter="20">
        <el-col :span="10">
          字段名:
          <el-input
            :value="param.key"
            @change="updateParamKey(index,$event)"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="10">
          字段值:
          <el-input
            :value="param.value"
            @change="updateParamValue(index,$event)"
            clearable
          ></el-input>
        </el-col>
      </el-row>

      <!-- 按钮 -->
      <el-row>
        <el-button type="info" @click="addParam">添加参数</el-button>
        <el-button type="success" @click="format">翻译</el-button>
      </el-row>

      <!-- 预览结果 -->
      <el-row>
        <el-col :span="10" >
          <div class="grid-content bg-purple preview-result">
            {{formattedFromText}}
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple-light preview-result">
            {{formattedToText}}
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import formatterMixin from '../mixins/formatterMixin';

export default {
  name: 'trans-item-preview',
  mixins: [formatterMixin],
  props: {
    fromText: {
      type: String,
      required: true,
    },
    toText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      previewParamList: [],
      formattedFromText: this.fromText,
      formattedToText: this.toText,
    };
  },
  computed: {
    ...mapState({
      fromLocale: 'fromLocale',
      toLocale: 'toLocale',
    }),
  },
  watch: {
    toText(newVal) {
      this.formattedToText = newVal;
    },
  },
  methods: {
    addParam() {
      this.previewParamList.push({
        key: '',
        value: '',
      });
    },
    updateParamKey(index, newKey) {
      const list = this.previewParamList;
      list.splice(index, 1, {
        ...list[index],
        key: newKey,
      });
    },
    updateParamValue(index, newVal) {
      const list = this.previewParamList;
      list.splice(index, 1, {
        ...list[index],
        value: newVal,
      });
    },

    /** TODO: 使用新版的MessageFormat */
    getFormattedResult(mf, locale, text) {
      let message = () => {};
      try {
        message = mf.compile(text, locale);
      } catch (e) {
        this.$message.error(`格式错误,${e}`);
      }
      const o = this.previewParamList.reduce((total, cur) => {
        if (cur.key.trim()) {
          // eslint-disable-next-line
          total[cur.key] = cur.value;
        }
        return total;
      }, {});
      return message(o);
    },
    format() {
      const {
        fromText,
        formatterWithFromLocale,
        fromLocale,
        toText,
        formatterWithToLocale,
        toLocale,
      } = this;

      this.formattedFromText = this.getFormattedResult(
        formatterWithFromLocale,
        fromLocale,
        fromText,
      );
      this.formattedToText = this.getFormattedResult(formatterWithToLocale, toLocale, toText);
    },
  },
};
</script>

<style scoped>
.preview-result {
  color: #67c23a;
}
</style>

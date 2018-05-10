<template>
  <div class="trans-item">
    <!-- 词包翻译区 -->
    <el-row :gutter="20">
      <el-col :span="10" >
        <div class="grid-content bg-purple">
          <!-- <el-input  type="textarea" autosize v-model="fromText"></el-input> -->
          <p style="margin: 0;">{{fromText}}</p>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <div>
            <variable-tool @confirm="addVariable"></variable-tool>
            <plural-tool @confirm="addPlural"></plural-tool>
            <select-tool @confirm="addSelect"></select-tool>
          </div>
          <el-input  type="textarea" autosize v-model="toText"></el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">
          <el-button type="success" @click="checkFormat">校验格式</el-button>
          <el-button type="primary" @click="togglePreview">
            {{showPreview ? '收起' : '预览' }}
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- TODO: 预览功能抽取公共组件 -->
    <!-- 预览 -->
    <div v-show='showPreview'>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import MessageFormat from 'messageformat';
import PluralTool from './PluralTool';
import SelectTool from './SelectTool';
import VariableTool from './VariableTool';

export default {
  name: 'trans-item',
  components: {
    PluralTool,
    SelectTool,
    VariableTool,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showPreview: false,
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
    ...mapGetters(['getTextByPath']),
    fromText() {
      return this.getTextByPath(this.fromLocale, this.path);
    },
    toText() {
      return this.getTextByPath(this.toLocale, this.path);
    },
  },
  methods: {
    togglePreview() {
      this.showPreview = !this.showPreview;
    },
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
    /**  TODO: 在无法转换时提示报错信息;  TODO: 使用新版的MessageFormat */
    getFormattedResult(locale, text) {
      const mf = new MessageFormat(locale);
      mf.setIntlSupport(true);

      const message = mf.compile(text, locale);
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
      this.formattedFromText = this.getFormattedResult(this.fromLocale, this.fromText);
      this.formattedToText = this.getFormattedResult(this.toLocale, this.toText);
    },
    checkFormat() {
      // TODO:
    },
    addVariable({ variableName }) {
      this.toText += `{${variableName}}`;
    },
    addPlural() {},
    addSelect() {},
  },
};
</script>

<style scoped>
.el-input {
  width: auto;
}
.el-row {
  margin: 20px 0;
}
.trans-item {
  /* background-color: rgba(200, 200, 200, 0.3); */
}
.preview-result {
  color: #96e06e;
}
</style>

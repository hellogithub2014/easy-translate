<template>
  <div class="trans-item">
    <!-- 词包翻译区 -->
    <el-row :gutter="20">
      <el-col :span="10" >
        <div class="grid-content bg-purple">
          <p style="margin: 0;">{{fromText}}</p>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <div>
            <variable-tool @confirm="addVariable"></variable-tool>
            <plural-tool @confirm="addPlural"></plural-tool>
            <!-- 暂时不添加多选一 -->
            <!-- <select-tool @confirm="addSelect"></select-tool> -->
          </div>
          <el-input  type="textarea" autosize :value="toText" @change="updateToText"></el-input>
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

    <!-- 预览 -->
    <trans-item-preview
      v-show="showPreview"
      :fromText="fromText"
      :toText="toText"
    ></trans-item-preview>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import PluralTool from './PluralTool';
import VariableTool from './VariableTool';
import TransItemPreview from './TransItemPreview';

import TYPES from '../store/mutation-types';

export default {
  name: 'trans-item',
  components: {
    PluralTool,
    VariableTool,
    TransItemPreview,
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
    ...mapMutations({
      updateText: TYPES.UPDATE_TEXT,
    }),

    togglePreview() {
      this.showPreview = !this.showPreview;
    },

    checkFormat() {
      // TODO:  检查词条文本格式
    },

    /** 翻译文本中追加插值  */
    addVariable({ variableName }) {
      const newText = `${this.toText}{${variableName}}`;

      this.updateText({
        locale: this.toLocale,
        newText,
        path: this.path,
      });
    },

    /** 翻译文本中追加单复数  */
    addPlural({ plural, zero, one, other }) {
      let addedText = `{${plural}, plural, `;

      addedText += `=0{${zero}} `;

      if (one.trim()) {
        addedText += `one{${one}} `;
      }

      addedText += `other{${other}}}`;

      this.updateText({
        locale: this.toLocale,
        newText: this.toText + addedText,
        path: this.path,
      });
    },

    /** 更改store中的目标翻译文本  */
    updateToText(newText) {
      this.updateText({
        locale: this.toLocale,
        newText,
        path: this.path,
      });
    },
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
  background-color: rgba(200, 200, 200, 0.3);
}
</style>

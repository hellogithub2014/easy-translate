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
            <el-button type="primary" size="mini" @click="addPlainTextTool">纯文本</el-button>
            <el-button type="primary" size="mini" @click="addVariableTool">插值</el-button>
            <el-button type="primary" size="mini" @click="addPluralTool">单复数</el-button>
          </div>
          <div>
            <span  class="component-wrapper" v-for="(tool,index) in tools" :key="index">
              <span class="cross" @click="removeTool(index)">x</span>
              <component
                :is="tool.component"
                :value="tool.value"
                @cancel="removeTool(index)"
                @add="addToText"
                @update="changeToText(index, $event)">
              </component>
            </span>
          </div>
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

import PluralTool from './tools/PluralTool';
import VariableTool from './tools/VariableTool';
import PlainTextTool from './tools/PlainTextTool';
import TransItemPreview from './TransItemPreview';

import TYPES from '../store/mutation-types';
import TOOL_NAME from '../const/tool-name';

export default {
  name: 'trans-item',
  components: {
    PluralTool,
    VariableTool,
    PlainTextTool,
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
      tools: [],
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
  mounted() {
    this.tools.push({
      component: 'plain-text-tool',
      value: {
        plainText: this.fromText,
        composeText: this.fromText, // 用于在计算拼接词条时统一用的属性
      },
    });
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

    /**
     * @param { KeyboardEvent } keyboardEvent
     */
    tryAddTool(keyboardEvent) {
      switch (keyboardEvent.key.toUpperCase()) {
        case 'T':
          this.addPlainText();
          break;
        case 'U':
          this.addPluralTool();
          break;
        case 'I':
          this.addVariableTool();
          break;
        default:
          break;
      }
    },

    addPlainTextTool() {
      this.tools.push({
        component: TOOL_NAME.PLAIN_TEXT_TOOL,
        value: {
          plainText: '',
          composeText: '',
        },
      });
    },
    /** 翻译文本中追加插值  */
    addVariableTool() {
      this.tools.push({
        component: TOOL_NAME.VARIABLE_TOOL,
        value: {
          variableName: '',
          showDialog: true,
          isNew: true,
          composeText: '',
        },
      });
    },
    /** 翻译文本中追加单复数  */
    addPluralTool() {
      this.tools.push({
        component: TOOL_NAME.PLURAL_TOOL,
        value: {
          plural: '',
          zero: '',
          one: '',
          other: '',
          showDialog: true,
          isNew: true,
          composeText: '',
        },
      });
    },

    removeTool(index) {
      this.tools.splice(index, 1);
      this.updateToText(this.composeAllToolText());
    },

    addToText(eventParam) {
      this.changeToText(this.tools.length - 1, eventParam);
    },

    changeToText(index, eventParam) {
      // const newValue = this.updateToolValue(this.tools[index]);

      this.tools.splice(index, 1, {
        ...this.tools[index],
        value: {
          ...this.tools[index].value,
          ...eventParam,
        },
      });
      this.updateToText(this.composeAllToolText());
    },

    // 组合所有tool的composeText
    composeAllToolText() {
      return this.tools.reduce((result, cur) => result + cur.value.composeText, '');
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

<style scoped lang="scss">
.component-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
}
.cross {
  display: none;
  position: absolute;
  top: -11px;
  right: -5px;
  height: 16px;
  border-radius: 8px;
  background-color: rgba(200, 10, 10, 0.8);
  width: 16px;
  color: #fff;
  text-align: center;
  line-height: 16px;
}

.component-wrapper:hover .cross {
  display: block;
}

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

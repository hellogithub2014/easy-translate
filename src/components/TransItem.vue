<template>
  <div class="trans-item">
    <!-- 第一行，一些状态和工具 -->
    <el-row class="tools-wrapper">
      <el-col :span="12" class="center-middle">
        <span> ###id</span>
      </el-col>
      <el-col :span="12" class="center-middle">
        <el-button type="primary" v-if="isExpertMode" size="mini" @click="addPlainTextTool">纯文本</el-button>
        <el-button type="primary" v-if="isExpertMode" size="mini" @click="addVariableTool">插值</el-button>
        <el-button type="primary" v-if="isExpertMode" size="mini" @click="addPluralTool">单复数</el-button>
        <el-button type="success" v-if="isExpertMode" size="mini" @click="checkFormat">校验格式</el-button>
      </el-col>
    </el-row>

    <!-- 第二行，翻译区域 -->
    <el-row class="translate-wrapper">
      <!-- 左列只读基础文本 -->
      <el-col :span="12" :class="{'space-between':isExpertMode, 'center-middle':isNormalMode }">
        <div class="translate-area" v-if="isExpertMode">
          <span  class="component-wrapper" v-for="(tool,index) in toolsOfFromText" :key="index">
              <component
                :is="tool.component"
                :value="tool.value"
                :locale="fromLocale"
                :read-only="tool.value.readonly">
              </component>
            </span>
        </div>
        <!-- 预览 -->
        <trans-item-preview
          v-if="isExpertMode"
          :tools="toolsOfFromText"
          :locale="fromLocale"
        ></trans-item-preview>

        <p v-if="isNormalMode">{{fromText}}</p>
      </el-col>
      <!-- 右列可操作翻译文本 -->
      <el-col :span="12" :class="{'space-between':isExpertMode, 'center-middle':isNormalMode }">
        <div class="translate-area" v-if="isExpertMode">
          <span
            class="component-wrapper"
            v-for="(tool,index) in toolsOfToText"
            :key="index">
            <span class="cross" @click="removeTool(index)">x</span>
            <component
              :is="tool.component"
              :value="tool.value"
              :locale="toLocale"
              @cancel="removeTool(index)"
              @add="addToText"
              @update="changeToText(index, $event)">
            </component>
          </span>
        </div>
          <!-- 预览 -->
        <trans-item-preview
          v-if="isExpertMode"
          :tools="toolsOfToText"
          :locale="toLocale"
        ></trans-item-preview>

        <el-input
          v-if="isNormalMode"
          v-model="toText"
          type="textarea"
          :rows="3"
          :cols="10"
          clearable
        ></el-input>

      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import formatterMixin from '../mixins/formatterMixin';

import PluralTool from './tools/PluralTool';
import VariableTool from './tools/VariableTool';
import PlainTextTool from './tools/PlainTextTool';
import TransItemPreview from './TransItemPreview';

import TYPES from '../store/mutation-types';

import formatParser from '../utils/format-parser';
import translateTool from '../utils/translate-tool';

export default {
  name: 'trans-item',
  mixins: [formatterMixin],
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
      toolsOfToText: [],
    };
  },
  computed: {
    ...mapState({
      fromLocale: 'fromLocale',
      toLocale: 'toLocale',
    }),
    ...mapGetters(['getTextByPath', 'isNormalMode', 'isExpertMode']),
    fromText() {
      return this.getTextByPath(this.fromLocale, this.path);
    },
    toText() {
      return this.getTextByPath(this.toLocale, this.path);
    },
    toolsOfFromText() {
      return formatParser.parseTranslateTools(this.fromText, true);
    },
  },
  watch: {
    toLocale() {
      this.toolsOfToText = formatParser.parseTranslateTools(this.toText);
    },
  },
  mounted() {
    this.toolsOfToText = formatParser.parseTranslateTools(this.toText);
  },
  methods: {
    ...mapMutations({
      updateText: TYPES.UPDATE_TEXT,
    }),

    togglePreview() {
      this.showPreview = !this.showPreview;
    },

    checkFormat() {
      const { toLocale, toText, formatterWithToLocale } = this;
      try {
        formatterWithToLocale.compile(toText, toLocale);
        this.$message.success('格式正确');
      } catch (e) {
        this.$message.error(`格式错误,${e}`);
      }
    },

    addPlainTextTool() {
      this.toolsOfToText.push(translateTool.generatePlainTextTool());
    },
    /** 翻译文本中追加插值  */
    addVariableTool() {
      this.toolsOfToText.push(translateTool.generateVaribaleTool({ showDialog: true, isNew: true }));
    },
    /** 翻译文本中追加单复数  */
    addPluralTool() {
      this.toolsOfToText.push(translateTool.generatePluralTool({ showDialog: true, isNew: true }));
    },

    removeTool(index) {
      this.toolsOfToText.splice(index, 1);
      this.updateToText(this.composeAllToolText());
    },

    addToText(eventParam) {
      this.changeToText(this.toolsOfToText.length - 1, eventParam);
    },

    changeToText(index, eventParam) {
      this.toolsOfToText.splice(index, 1, {
        ...this.toolsOfToText[index],
        value: {
          ...this.toolsOfToText[index].value,
          ...eventParam,
        },
      });
      this.updateToText(this.composeAllToolText());
    },

    // 组合所有tool的composeText
    composeAllToolText() {
      return this.toolsOfToText.reduce((result, cur) => result + cur.value.composeText, '');
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
.space-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.center-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-col {
  border: 1px solid #fff;
  border-radius: 4px;
  height: 40px;
}

.trans-item {
  background-color: rgba(200, 200, 200, 0.3);
}

.tools-wrapper {
  margin-top: 20px;
}

.translate-wrapper {
  display: flex;
  align-items: center;

  .el-input {
    width: auto;
  }

  .component-wrapper {
    display: inline-block;
    position: relative;
    cursor: pointer;

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

    &:hover .cross {
      display: block;
    }
  }

  .translate-area {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .el-col {
    height: 100px;
  }
}
</style>

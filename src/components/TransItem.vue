<template>
  <div class="trans-item">
    <!-- 词包翻译区 -->
    <el-row :gutter="20" class="translate-wrapper">
      <el-col :span="9" >
        <div class="grid-content bg-purple">
          <!-- <p style="margin: 0;">{{fromText}}</p> -->
          <span  class="component-wrapper" v-for="(tool,index) in toolsOfFromText" :key="index">
              <component
                :is="tool.component"
                :value="tool.value"
                :locale="fromLocale"
                :read-only="tool.value.readonly">
              </component>
            </span>
        </div>
      </el-col>
      <el-col :span="2">
        ======>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple-light">
          <div>
            <el-button type="primary" size="mini" @click="addPlainTextTool">纯文本</el-button>
            <el-button type="primary" size="mini" @click="addVariableTool">插值</el-button>
            <el-button type="primary" size="mini" @click="addPluralTool">单复数</el-button>
          </div>
          <div>
            <span  class="component-wrapper" v-for="(tool,index) in toolsOfToText" :key="index">
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
    ...mapGetters(['getTextByPath']),
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
      this.toolsOfToText.push(translateTool.generatePlainTextTool());
    },
    /** 翻译文本中追加插值  */
    addVariableTool() {
      this.toolsOfToText.push(
        translateTool.generateVaribaleTool({ showDialog: true, isNew: true }),
      );
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
.translate-wrapper {
  display: flex;
  align-items: center;
}

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

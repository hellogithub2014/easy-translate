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
            <el-button type="primary" size="mini" @click="addPlainText">纯文本</el-button>
            <el-button type="primary" size="mini" @click="addVariable">插值</el-button>
            <el-button type="primary" size="mini" @click="addPlural">单复数</el-button>
          </div>
          <div>
            <span  class="component-wrapper" v-for="(tool,index) in tools" :key="index">
              <span class="cross" @click="removeTool(index)">x</span>
              <component
                :is="tool.component"
                :value="tool.value"
                @cancel="removeTool(index)">
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
          this.addPlural();
          break;
        case 'I':
          this.addVariable();
          break;
        default:
          break;
      }
    },

    removeTool(index) {
      this.tools.splice(index, 1);
    },

    addPlainText() {
      this.tools.push({
        component: 'plain-text-tool',
        value: {
          plainText: '',
        },
      });
    },
    /** 翻译文本中追加插值  */
    addVariable() {
      // const newText = `${this.toText}{${variableName}}`;

      // this.updateText({
      //   locale: this.toLocale,
      //   newText,
      //   path: this.path,
      // });

      this.tools.push({
        component: 'variable-tool',
        value: {
          variableName: '',
          showDialog: true,
          isNew: true,
        },
      });
    },

    /** 翻译文本中追加单复数  */
    addPlural() {
      // let addedText = `{${plural}, plural, `;

      // addedText += `=0{${zero}} `;

      // if (one.trim()) {
      //   addedText += `one{${one}} `;
      // }

      // addedText += `other{${other}}}`;

      // this.updateText({
      //   locale: this.toLocale,
      //   newText: this.toText + addedText,
      //   path: this.path,
      // });

      this.tools.push({
        component: 'plural-tool',
        value: {
          plural: '',
          zero: '',
          one: '',
          other: '',
          showDialog: true,
          isNew: true,
        },
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

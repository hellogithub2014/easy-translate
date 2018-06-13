<template>
  <div class="trans-item">
    <!-- 第一行，一些状态和工具 -->
    <el-row class="tools-wrapper">
      <el-col :span="12" class="center-middle">
        <span> ###id</span>
      </el-col>
      <el-col :span="12" class="center-middle">
      </el-col>
    </el-row>

    <!-- 第二行，翻译区域 -->
    <el-row class="translate-wrapper">
      <!-- 左列只读基础文本 -->
      <el-col :span="12" class="center-middle">
        <p>{{composedTextOfFromTools}}</p>
      </el-col>
      <!-- 右列可操作翻译文本 -->
      <el-col :span="12" class="center-middle">
        <el-input
          :value="composedTextOfToTools"
          @change="updateToText"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TYPES from '../store/mutation-types';
import TOOL_NAME from '../const/tool-name';
import formatParser from '../utils/format-parser';

export default {
  name: 'trans-item',
  props: {
    path: {
      type: String,
      required: true,
    },
    // 是否为某一单复数词条拆分后的词条
    isOneOfDecomposedPlural: {
      type: Boolean,
      default: false,
    },
    toolsOfFromText: {
      type: Array,
      required: true,
    },
    toolsOfToText: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      toLocale: 'toLocale',
    }),
    // 所有来源tools的合成composeText
    composedTextOfFromTools() {
      return formatParser.parseToolsToPlainText(this.toolsOfFromText);
    },
    // 所有目标tools的合成composeText
    composedTextOfToTools() {
      return formatParser.parseToolsToPlainText(this.toolsOfToText);
    },
    // 是否包含插值tool
    isContainsVariableTool() {
      return this.toolsOfToText.includes(tool => tool.component === TOOL_NAME.VARIABLE_TOOL);
    },
  },
  methods: {
    ...mapMutations({
      updateText: TYPES.UPDATE_TEXT,
    }),

    /** 更改store中的目标翻译文本  */
    updateToText(newText) {
      // 如果当前词条只是拆分后单复数词条的其中一条，那么需要父组件才能知道怎么更新
      // TODO: 考虑#的处理
      if (this.isOneOfDecomposedPlural) {
        this.$emit('update-plural-text', newText);
        return;
      }

      // 如果只是纯文本，直接更新即可。 TODO: 包含插值tool的更新
      // if (!this.isContainsVariableTool) {
      this.updateText({
        locale: this.toLocale,
        newText,
        path: this.path,
      });
    },
    // },
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

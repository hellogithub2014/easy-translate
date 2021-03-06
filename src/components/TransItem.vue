<template>
  <div class="trans-item">

    <!-- 第一行，一些状态和工具 -->
    <el-row class="tools-wrapper">
      <el-col :span="12" class="center-middle">
        <span> ###id</span>
      </el-col>
      <el-col :span="12" class="center-middle">
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          v-show="showEscapeHint"
          :content="escapeHint">
          <el-button  size="mini" slot="reference">遇到<strong>{}</strong>报错？</el-button>
        </el-popover>
        <el-button @click="showSceneUpdateDialog=true" size="mini" icon="el-icon-picture">修改场景</el-button>
        <el-button @click="tryDeleteTransItem" size="mini" icon="el-icon-delete">删除</el-button>
      </el-col>
    </el-row>

    <!-- 第二行，翻译区域 -->
    <el-popover
      placement="bottom"
      trigger="click"
      width="800"
      title="词条场景"
    >
      <!-- 场景提示器 -->
      <scene-hinter v-if="sceneImages.length" :scene-images="sceneImages"></scene-hinter>
      <p v-else>暂未提供场景</p>
      <el-row class="translate-wrapper" slot="reference">
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
    </el-popover>

    <!-- 删除词条弹窗 -->
    <el-dialog
      width="30%"
      title="确认删除"
      :visible.sync="showDeleteEntryDialog">
      <div>
        是否确认删除？如果删除的词条线上环境仍在使用，可能会导致线上报错。
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDeleteEntryDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteEntry">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑词条场景弹窗 -->
    <el-dialog
      width="80%"
      title="更新词条场景"
      :visible.sync="showSceneUpdateDialog">
      <scene-uploader ref="sceneUploader" :init-images="sceneForUploader"></scene-uploader>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSceneUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateTransItemScene">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import TYPES from '../store/mutation-types';
import TOOL_NAME from '../const/tool-name';
import formatParser from '../utils/format-parser';
import formatterMixin from '../mixins/formatterMixin';
import SceneHinter from './SceneHinter';
import SceneUploader from './SceneUploader';

export default {
  name: 'trans-item',
  mixins: [formatterMixin],
  components: {
    SceneHinter,
    SceneUploader,
  },
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
    // 场景图片
    sceneImages: {
      type: Array,
      default: () => [], // TODO: remove
    },
  },
  data() {
    return {
      showEscapeHint: false,
      showDeleteEntryDialog: false,
      showSceneUpdateDialog: false,
    };
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
    escapeHint() {
      return `『{』和『}』是保留的字符，通常用于表示插值或者其他更高级的格式。
        如果确实想输入普通的『{』或『}』，可以在它们的两边都加上单引号'，
        例如"This is a '{' " 最后会被自动转成 "This is a { "`;
    },
    // scene-uploader组件内部需要的格式
    sceneForUploader() {
      return this.sceneImages.map(url => ({
        response: {
          url,
        },
      }));
    },
  },
  methods: {
    ...mapMutations({
      updateText: TYPES.UPDATE_TEXT,
    }),
    ...mapActions({
      updateTextScene: TYPES.UPDATE_TEXT_SCENE,
    }),
    /** 更改store中的目标翻译文本  */
    updateToText(newText) {
      // 校验一下格式
      const { error, msg, char } = formatParser.checkFormat(this.formatterWithToLocale, newText, this.toLocale);
      if (error) {
        this.$message.error(msg);
        if (char && /{|}/.test(char)) {
          this.showEscapeHint = true; // 显示转义提示
        }
      } else {
        this.showEscapeHint = false;
      }

      // 如果当前词条只是拆分后单复数词条的其中一条，那么需要父组件才能知道怎么更新
      if (this.isOneOfDecomposedPlural) {
        this.$emit('update-plural-text', newText);
        return;
      }

      // 自己直接就可以更新store
      this.updateText({
        locale: this.toLocale,
        newText,
        path: this.path,
      });
    },
    /**
     * 删除词条弹窗
     */
    tryDeleteTransItem() {
      this.showDeleteEntryDialog = true;
    },
    /**
     * 确认删除词条
     */
    confirmDeleteEntry() {
      this.showDeleteEntryDialog = false;
      this.$emit('delete');
    },
    /**
     * 更新场景图片
     */
    updateTransItemScene() {
      this.showSceneUpdateDialog = false;
      // store中只记录图片url
      const allImages = this.$refs.sceneUploader.allImages.map(image => image.response.url);
      this.updateTextScene({ path: this.path, scene: allImages });
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

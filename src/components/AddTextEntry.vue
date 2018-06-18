<template>
  <span>
    <el-button type="primary" @click="showDialog=true;" round>
      <i class="el-icon-edit"></i>
      添加词条
    </el-button>

    <el-dialog title="添加词条" :visible.sync="showDialog" :width="'80%'">
      <el-row>

        <!-- 表单区域 -->
        <el-col :span="22">
          <el-row :gutter="20" v-for="(entry,index) in entryList" :key="index" class="entry-area">
            <el-col :span="10">
              词条路径(以点号分隔):
              <el-input v-model="entry.path" clearable></el-input>
            </el-col>
            <el-col :span="14">
              词条文本:
              <el-input type="textarea" autosize v-model="entry.text">
              </el-input>
            </el-col>
          </el-row>
        </el-col>

        <!-- 右侧添加按钮 -->
        <el-col :span="2">
          <el-button  type="primary" icon="el-icon-circle-plus" @click="addEntry"></el-button>
        </el-col>
      </el-row>

      <scene-uploader ref="sceneUploader" @change="addTextScene"></scene-uploader>

      <!-- 内层的二次确认弹窗 -->
      <el-dialog
        width="30%"
        title="确认添加"
        :visible.sync="showDoubleCheckDialog"
        append-to-body>
        <div>
          以下路径在词包中并不存在，是否确认添加?
          <ul>
            <li v-for='(path,index) in allNoneExistPaths' :key='index'>{{path}}</li>
          </ul>
        </div>
        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDoubleCheckDialog = false">取 消</el-button>
          <el-button type="primary" @click="doubleConfirm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>

    </el-dialog>
  </span>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import TYPES from '../store/mutation-types';
import SceneUploader from './SceneUploader';

export default {
  name: 'add-text-entry',
  components: {
    SceneUploader,
  },
  data() {
    return {
      showDialog: false,
      showDoubleCheckDialog: false,
      entryList: [
        {
          path: '',
          text: '',
        },
      ],
      allNoneExistPaths: [],
      scene: [],
    };
  },
  computed: {
    ...mapGetters(['validToLocaleList']),
  },
  methods: {
    ...mapActions({
      bacthAddEntry: TYPES.BATCH_ADD_ENTRY,
    }),
    confirm() {
      this.allNoneExistPaths = this.filterAllNoneExistPaths();
      if (this.allNoneExistPaths.length) {
        this.showDoubleCheckDialog = true;
        return;
      }

      this.doBathcAddEntry();
    },
    doBathcAddEntry() {
      const { entryList, scene } = this;

      this.bacthAddEntry({ entryList, scene: scene.map(image => image.response.url) });

      this.entryList = [
        {
          path: '',
          text: '',
        },
      ];
      this.clearTextScene();
      this.showDialog = false;
      this.$message.success('成功增加词条');
    },
    addEntry() {
      this.entryList.push({
        path: '',
        text: '',
      });
    },
    filterAllNoneExistPaths() {
      const { entryList } = this;
      const { state } = this.$store;
      const localeMessage = state.messages[state.availableLocales.zh];
      return entryList
        .filter((entry) => {
          // 判断上一段路径是否存在， 如a.b.c， 判断的是 a.b是否存在， 找出所有不存在的
          const splitArr = entry.path.split('.');
          // 如果路径只有一段，如 'a'， 直接判断存在
          if (splitArr.length <= 1) {
            return false;
          }

          const value = _.get(localeMessage, splitArr.slice(0, -1).join('.')); // 获取上一段路径对应的值

          return !_.isObject(value); // path在localeMessage中对应的值不是一个对象
        })
        .map(entry => entry.path);
    },
    doubleConfirm() {
      this.showDoubleCheckDialog = false;
      this.doBathcAddEntry();
    },
    addTextScene(sceneImages) {
      // TODO 添加场景
      this.scene = sceneImages;
    },
    /**
     * 清除场景图片
     */
    clearTextScene() {
      this.$refs.sceneUploader.clearAllImages();
    },
  },
};
</script>

<style scoped>
.entry-area {
  margin: 20px 0;
}
.entry-area .el-input {
  width: calc(100% - 150px);
}
.entry-area .el-textarea {
  width: calc(100% - 100px);
}
</style>

<template>
  <div>
    <!-- 上传词条场景， 目标： 支持图片和链接形式的场景。图片支持粘贴板上传、拖拽和选择3种形式 -->
    <el-row>
      <!-- 上传区域 -->
      <el-col :span="8">
        <div class="upload-wrapper" @paste="pasteImage">
          <div style="height:30px;">
            <p v-if="!uploadingImageFromPaste">tips: 点击这里的空白处，可以直接从粘贴板上传图片</p>
            <el-progress v-else :percentage="uploadingImageFromPaste.percentage | toInt"></el-progress>
          </div>

          <el-upload
            drag
            multiple
            :name="fileName"
            :accept="joinedImageTypes"
            :with-credentials="true"
            :action="action"
            :headers="headers"
            :show-file-list="false"
            :on-success="selectOrDragFileSuccess"
            :on-progress="getUploadingFiles"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <!-- 进度条 -->
          <el-progress
            v-for="(item,index) in uploadingImagesSelectOrDrag"
            :percentage="item.percentage | toInt"
            :key="index">
          </el-progress>
          </div>
      </el-col>

      <!-- 已上传的图片列表 -->
      <el-col :span="16">
        <ul v-if="allImages.length">
          <li v-for="(image, index) in allImages" :key="index" class="img-item">
            <span>{{image.name}}</span> -
            <span>{{image.size | formatSize}}</span>
            <a href="javascript:;" size="mini" type="success" @click="previewImage(index)">预览</a>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showPreviewDialog"
      @close="showPreviewDialog=false"
      append-to-body
      width="60%"
    >
    <div v-loading="shouldShowPreviewLoading">
      <img width="100%" :src="curPreviewImageUrl" @load="finishLoadingPreviewImage" >
    </div>
    </el-dialog>
  </div>
</template>

<script>
import ajaxUpload from '../utils/upload';

export default {
  name: 'scene-uploader',
  data() {
    return {
      imagesFromPaste: [], // 所有从粘贴板已上传完成的图片
      imagesFromSelectOrDrag: [], // 所有拖拽或选择的已上传完成的图片
      uploadingImageFromPaste: null, // 粘贴板中正在上传的图片，一次只能弄一个图片，故此属性用对象即可
      uploadingImagesSelectOrDrag: [], // 拖拽或选择的正在上传的图片数组，均可以一次上传多个，需要用数组
      showPreviewDialog: false, // 是否显示预览图片弹窗
      curPreviewImageUrl: '', // 当前正在预览的图片url
      imagePreviewCache: {}, //  缓存所有待预览的图片。 键：图片url、值complete：是否已加载好
    };
  },
  computed: {
    allImages() {
      return [].concat(this.imagesFromPaste, this.imagesFromSelectOrDrag);
    },
    action() {
      return '/tools/upload_image/';
    },
    headers() {
      return { 'X-CSRFToken': this.$cookie.get('csrftoken') };
    },
    imageTypes() {
      return ['png', 'jpg', 'jpeg', 'gif'].map(type => `image/${type}`);
    },
    joinedImageTypes() {
      return this.imageTypes.join(',');
    },
    fileName() {
      return 'Filedata';
    },
    defaultUploadOptions() {
      return {
        headers: this.headers,
        withCredentials: true, // 发送cookie
        // file: xxx,
        filename: this.fileName, // 表单的name
        action: this.action,
        onProgress: () => {},
        onSuccess: () => {
          this.$message.success('图片上传成功');
        },
        onError: () => {
          this.$message.error('图片上传失败，请重试');
        },
      };
    },
    /**
     * 是否显示预览图片时的loading
     */
    shouldShowPreviewLoading() {
      return !this.imagePreviewCache[this.curPreviewImageUrl];
    },
  },
  filters: {
    /**
     * 字节转为kb
     */
    formatSize(size) {
      const parsedSize = parseInt(size, 10);
      return `${(parsedSize / 1024).toFixed(2)}kb`;
    },
    toInt(num) {
      return parseInt(num, 10);
    },
  },
  methods: {
    finishLoadingPreviewImage() {
      this.imagePreviewCache = {
        ...this.imagePreviewCache,
        [this.curPreviewImageUrl]: true,
      };
    },
    /**
     * 通过粘贴板上传图片， 发现复制了多个图片同时粘贴时，items中始终只有一个是图片
     */
    pasteImage(pasteEvent) {
      const clipboardData = pasteEvent.clipboardData;
      const { items } = clipboardData;
      if (!items || !items.length) {
        return; // 粘贴板没有内容
      }

      // items不是Array对象，无法直接用forEach迭代
      [...items].forEach((item) => {
        const { kind, type } = item;
        if (kind === 'file' && this.imageTypes.includes(type)) {
          // 手动调用api上传，成功后再把对象push
          this.ajaxUploadImage(item.getAsFile());
        }
      });
    },

    /**
     * 手动上传
     */
    ajaxUploadImage(imgFile) {
      const options = {
        ...this.defaultUploadOptions,
        file: imgFile,
        onProgress: (res) => {
          this.defaultUploadOptions.onProgress(res);
          this.uploadingImageFromPaste = {
            percentage: res.percent,
          };
        },
        onSuccess: (res) => {
          this.defaultUploadOptions.onSuccess(res);
          this.uploadingImageFromPaste = null;
          this.imagesFromPaste.push({
            response: res,
            name: imgFile.name,
            size: imgFile.size,
          });
        },
      };
      ajaxUpload(options);
    },

    /**
     * 预览图片
     */
    previewImage(index) {
      this.showPreviewDialog = true;
      const {
        response: { url },
      } = this.allImages[index];
      this.curPreviewImageUrl = url;
    },

    /**
     * 成功拖拽或通过文件选择器上传图片。
     */
    selectOrDragFileSuccess(response, file, fileList) {
      this.uploadingImagesSelectOrDrag = [];
      this.imagesFromSelectOrDrag = [...fileList];
    },

    getUploadingFiles(event, file, fileList) {
      this.uploadingImagesSelectOrDrag = fileList.filter(item => item.percentage !== 100);
    },
  },
};
</script>

<style scoped lang="scss">
.upload-wrapper {
  border: 1px solid #eee;
  border-radius: 5px;
}
.img-item {
  text-align: left;
  margin-bottom: 10px;
}
</style>

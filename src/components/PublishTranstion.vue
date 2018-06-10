<template>
  <span>
    <!-- 悬浮效果： https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651554120&idx=2&sn=a872eb41d942aac5a9be35b37e8cce16&chksm=80255689b752df9f984d5b28dc45366c28a5bd865a81914748d55db1c0e8428fa7ad7e30ede9&scene=38#wechat_redirect -->
    <el-button  type="danger" @click="tryPublish" @mousemove="showRadialGradient" round>
      <i class="el-icon-check"></i>
      <span>发布</span>
    </el-button>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%">
      <span>确认发布？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false;">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import formatterMixin from 'mixins/formatterMixin';

export default {
  name: 'publish-transtion',
  mixins: [formatterMixin],
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    ...mapState({
      toLocale: 'toLocale',
    }),
    ...mapGetters(['getLocaleMessages']),
    toLocaleMessages() {
      return this.getLocaleMessages(this.toLocale);
    },
  },
  methods: {
    confirm() {
      this.showDialog = false;
      // TODO: 请求后端接口发送词条
    },
    showRadialGradient(e) {
      const x = e.pageX - e.target.offsetLeft;
      const y = e.pageY - e.target.offsetTop;
      e.target.style.setProperty('--x', `${x}px`);
      e.target.style.setProperty('--y', `${y}px`);
    },
    tryPublish() {
      const invalidMessages = this.getAllInvalidMessage();
      if (!invalidMessages.length) {
        this.showDialog = true;
      } else {
        this.$message.error(`第 ${invalidMessages.toString()} 个词条格式不对`);
      }
    },
    getAllInvalidMessage() {
      // TODO: 这里只校验了当前toLocale的词条，若此前切换过语言，也是需要校验的
      const { toLocale, toLocaleMessages, formatterWithToLocale, isValidFormat } = this;
      // 找出所有不合法的词条在列表中的索引，第一条的下标设为1
      return Object.keys(toLocaleMessages).reduce((invalidIndexes, curkey, index) => {
        const toText = toLocaleMessages[curkey];
        return invalidIndexes.concat(
          isValidFormat(formatterWithToLocale, toText, toLocale) ? [] : index + 1,
        );
      }, []);
    },
  },
};
</script>

<style scoped>
.el-button {
  position: relative;
  border: none;
  overflow: hidden;
}

.el-button span {
  position: relative;
}

.el-button::before {
  --size: 0;
  content: '';
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle closest-side, #461db6, transparent);
  transform: translate(-50%, -50%);
  transition: width 1s ease, height 1s ease;
}

.el-button:hover::before {
  --size: 400px;
}
</style>

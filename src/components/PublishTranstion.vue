<template>
  <span>
    <!-- 悬浮效果： https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651554120&idx=2&sn=a872eb41d942aac5a9be35b37e8cce16&chksm=80255689b752df9f984d5b28dc45366c28a5bd865a81914748d55db1c0e8428fa7ad7e30ede9&scene=38#wechat_redirect -->
    <el-button  type="danger" @click="showDialog=true;" @mousemove="showRadialGradient" round>
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
export default {
  name: 'publish-transtion',
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    confirm() {
      this.showDialog = false;
    },
    showRadialGradient(e) {
      const x = e.pageX - e.target.offsetLeft;
      const y = e.pageY - e.target.offsetTop;
      e.target.style.setProperty('--x', `${x}px`);
      e.target.style.setProperty('--y', `${y}px`);
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

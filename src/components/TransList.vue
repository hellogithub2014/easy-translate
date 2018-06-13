<template>
  <div>
    <trans-item v-for='(transItem,index) in splitedTransItems'
      :path="transItem.path"
      :tools-of-from-text="transItem.toolsOfFromText"
      :tools-of-to-text="transItem.toolsOfToText"
      :plural-property="transItem.pluralProperty"
      :key="index"
      ></trans-item>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';
import TransItem from './TransItem';
import formatParser from '../utils/format-parser';

export default {
  name: 'trans-list',
  components: {
    TransItem,
  },
  computed: {
    ...mapState({
      fromLocale: 'fromLocale',
      toLocale: 'toLocale',
    }),
    ...mapGetters(['textPathList', 'getTextByPath']),
    pathList() {
      return this.textPathList(this.fromLocale); // 以左侧的源文本为准
    },
    originTransItems() {
      return this.pathList.map((path) => {
        const fromText = this.getTextByPath(this.fromLocale, path);
        const toText = this.getTextByPath(this.toLocale, path);
        const toolsOfFromText = formatParser.parseTranslateTools(fromText, true);
        const toolsOfToText = formatParser.parseTranslateTools(toText);
        return {
          path,
          toolsOfFromText,
          toolsOfToText,
        };
      });
    },
    splitedTransItems() {
      const results = [];
      this.originTransItems.forEach((transItem) => {
        const tried = formatParser.trySplitPluralItem(transItem);
        // 不是数组说明这不是一个含有单复数的翻译词条
        if (!_.isArray(tried)) {
          results.push(_.cloneDeep(tried)); // 为防止子组件改变了origin的数据，统一采用深复制
        } else {
          results.push(...tried.map(item => _.cloneDeep(item)));
        }
      });
      return results;
    },
  },
};
</script>

<style scoped>
</style>

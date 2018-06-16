<template>
  <div>
    <trans-item v-for='(transItem,index) in splitedTransItems'
      :path="transItem.path"
      :tools-of-from-text="transItem.toolsOfFromText"
      :tools-of-to-text="transItem.toolsOfToText"
      :isOneOfDecomposedPlural="!!transItem.pluralProperty"
      :scene-images="transItem.scene"
      :key="index"
      @update-plural-text="updatePluralText(index,$event)"
      ></trans-item>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters, mapMutations } from 'vuex';
import TransItem from './TransItem';
import formatParser from '../utils/format-parser';
import TYPES from '../store/mutation-types';
import composeTextUtil from '../utils/compose-text-util';

export default {
  name: 'trans-list',
  components: {
    TransItem,
  },
  data() {
    return {
      pluralRecordCache: {}, // 记录每一个单复数词条被分散到整个transItems中的哪些索引,它负责保证分散到的位置是连续的，并且zero对应的是索引最小的那个
    };
  },
  computed: {
    ...mapState({
      fromLocale: 'fromLocale',
      toLocale: 'toLocale',
    }),
    ...mapGetters(['textPathList', 'getTextByPath', 'getTextScene']),
    pathList() {
      return this.textPathList(this.fromLocale); // 以左侧的源文本为准
    },
    originTransItems() {
      return this.pathList.map((path) => {
        const fromText = this.getTextByPath(this.fromLocale, path);
        const toText = this.getTextByPath(this.toLocale, path);
        const toolsOfFromText = formatParser.parseTranslateTools(fromText, true);
        const toolsOfToText = formatParser.parseTranslateTools(toText);
        // 两种语言的所有场景去重
        const sceneSet = new Set([...this.getTextScene(this.fromLocale, path), ...this.getTextScene(this.toLocale, path)]);

        return {
          path,
          scene: [...sceneSet],
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
          this.updatePluralRecordCache(transItem, results.length);
          results.push(...tried.map(item => _.cloneDeep(item)));
        }
      });
      return results;
    },
  },
  methods: {
    ...mapMutations({
      updateText: TYPES.UPDATE_TEXT,
    }),
    updatePluralRecordCache(originTransItem, startRecordIndex) {
      const tools = originTransItem.toolsOfFromText;
      const pluralToolIndex = formatParser.findPluralToolIndex(tools);
      const pluralTool = tools[pluralToolIndex];
      const { plural } = pluralTool.value;

      this.pluralRecordCache[originTransItem.path] = {
        indexes: [startRecordIndex, startRecordIndex + 1, startRecordIndex + 2], // 连续的3个
        plural,
      };
    },
    updatePluralText(index, newText) {
      const targetTransItem = this.splitedTransItems[index];
      // 其他两个拆分后的纯文本
      const otherSplitedTransItems = this.pluralRecordCache[targetTransItem.path].indexes.reduce((result, idx) => {
        if (idx !== index) {
          return result.concat(this.splitedTransItems[idx]);
        }
        return result;
      }, []);

      const plainText1 = formatParser.parseToolsToPlainText(otherSplitedTransItems[0].toolsOfToText);
      const plainText2 = formatParser.parseToolsToPlainText(otherSplitedTransItems[1].toolsOfToText);

      // 此处需要拼成{n,plural =0{xx} =1{xx} other{}}的格式，而不是简单相加
      const { plural, count } = targetTransItem.pluralProperty;
      let zero;
      let one;
      let other;

      switch (count) {
        case '=0':
          zero = newText;
          one = plainText1;
          other = plainText2;
          break;
        case '=1':
          one = newText;
          zero = plainText1;
          other = plainText2;
          break;
        case 'other':
          other = newText;
          zero = plainText1;
          one = plainText2;
          break;
        default:
          break;
      }

      this.updateText({
        locale: this.toLocale,
        newText: composeTextUtil.pluralTool({ plural, zero, one, other }),
        path: targetTransItem.path,
      });

      this.splitedTransItems.splice(index, 1, {
        ...targetTransItem,
        toolsOfToText: formatParser.parseTranslateTools(newText),
      });
    },
  },
};
</script>

<style scoped>
</style>

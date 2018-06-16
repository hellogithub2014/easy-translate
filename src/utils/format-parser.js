/* eslint-disable max-len */
import translateTool from '../utils/translate-tool';
import composeTextUtil from '../utils/compose-text-util';
import TOOL_NAME from '../const/tool-name';

const parser = require('intl-messageformat-parser');

const ELEMNT_TYPE = {
  TEXT: 'messageTextElement',
  ARGUMENT: 'argumentElement',
};

export default {
  /**
   * 从抽象语法树生成的各种tool
   *
   * @author liubin.frontend
   * @param {string} str
   */
  parseTranslateTools(str, readonly = false) {
    const ast = parser.parse(str);
    const { elements } = ast;
    // 目前认为除了messageTextElement就是argumentElement，不考虑其他的
    return elements.map((element) => {
      if (element.type === ELEMNT_TYPE.TEXT) {
        return this.parseToPlainTextTool(element, readonly); // 纯文本
      }
      if (!element.format) {
        return this.parseToVariableTool(element, readonly); // 插值
      }
      return this.parseToPluralTool(element, readonly); // 单复数
    });
  },
  /**
   * 从AST元素的插值元素中生成普通文本Tool
   *
   * @author liubin.frontend
   * @param {{type: string, id: string, format:null} messageTextElement
   * @returns
   */
  parseToPlainTextTool(messageTextElement, readonly = false) {
    const generaor = readonly ? translateTool.generateReadonlyPlainTextTool : translateTool.generatePlainTextTool;
    return generaor.call(translateTool, {
      plainText: messageTextElement.value,
      composeText: composeTextUtil.plainTextTool(messageTextElement.value),
    });
  },
  /**
   * 从AST元素的插值元素中生成插值变量名tool
   *
   * @author liubin.frontend
   * @param {{type: string, id: string, format:null} argumentElement
   * @returns
   */
  parseToVariableTool(argumentElement, readonly = false) {
    const generaor = readonly ? translateTool.generateReadonlyVaribaleTool : translateTool.generateVaribaleTool;
    return generaor.call(translateTool, {
      variableName: argumentElement.id,
      composeText: composeTextUtil.variableTool(argumentElement.id),
    });
  },
  /**
   * 从AST元素的插值元素中生成单复数tool
   *
   * @author liubin.frontend
   * @param { {type: string, id: string,format:{type: string, offset: number, options: {type:string, selector:string,value:{type:string,elements: {type:string,value:string}[]}}[]}} argumentElement
   * @returns
   */
  parseToPluralTool(argumentElement, readonly = false) {
    const {
      id: plural,
      format: { options },
    } = argumentElement;

    const generaor = readonly ? translateTool.generateReadonlyPluralTool : translateTool.generatePluralTool;

    const { zero, one = '', other } = options.reduce((result, option) => {
      const resultClone = result;
      const text = option.value.elements[0].value;
      switch (option.selector) {
        case '=0':
          resultClone.zero = text;
          break;
        case '=1':
        case 'one':
          resultClone.one = text;
          break;
        case 'other':
          resultClone.other = text;
          break;
        default:
          break;
      }
      return resultClone;
    }, {});

    return generaor.call(translateTool, {
      plural,
      zero,
      one,
      other,
      composeText: composeTextUtil.pluralTool({ plural, zero, one, other }),
    });
  },
  /**
   * 计算单复数形式下，给翻译人员提示的实时翻译结果
   *
   * @author liubin.frontend
   * @param {*} { other }
   * @param {*} isLocaleEN
   * @returns
   */
  pluralPreview({ other }, isLocaleEN) {
    const replaced = other.replace('#', 'xx');
    return isLocaleEN ? `${replaced}(s)` : replaced;
  },

  /**
   * 校验词条格式是否符合ICU规范
   *
   * @author liubin.frontend
   * @param {any} formatter
   * @param {string} text 待校验的文本
   * @param {string} locale 文本使用的语言
   * @returns {{err:any,msg:string} 一个对象，包含error和msg，如果格式合法，error为null，否之为具体错误信息
   */
  checkFormat(formatter, text, locale) {
    try {
      formatter.compile(text, locale);
      return {
        error: null,
        msg: '格式正确',
      };
    } catch (err) {
      const { found, location = {} } = err;
      const { start, end } = location;
      let msg = '格式错误';
      if (start && end) {
        msg += `，第${start.line}行第${start.column}列 ~ 第${end.line}行第${end.column}列`;
      }
      if (found) {
        msg += `,错误的字符： ${found}`;
      }

      return {
        error: err,
        char: found,
        msg,
      };
    }
  },

  /**
   * 查找是否存在plural-tool
   *
   * @author liubin.frontend
   * @param {any[]} tools
   * @returns 如果有返回它的索引，否则返回-1
   */
  findPluralToolIndex(tools) {
    return tools.findIndex(tool => tool.component === TOOL_NAME.PLURAL_TOOL);
  },
  /**
   * 将含有单复数的词条拆分为3个独立的纯文本词条。
   * 这里会假定：如果来源文本含有单复数，那么目标文本也是含有单复数的
   *
   * @example
   * "You have {n, plural, =0{no messages} =1{ 1 message} other{# messages}}."  =>
   *  "You have no messages"
   *  "You have 1 message"
   *  "You have # messages"
   *
   * @author liubin.frontend
   * @param {{path:string,toolsOfFromText:any[], toolsOfToText:any[],scene:string[]}} transItem 词条
   * @returns
   */
  trySplitPluralItem(transItem) {
    const toolsOfFromText = transItem.toolsOfFromText;
    const toolsOfToText = transItem.toolsOfToText;
    const pluralToolIndex = this.findPluralToolIndex(toolsOfFromText);

    // 不是单复数词条
    if (pluralToolIndex === -1) {
      return transItem;
    }

    // 将一个包含单复数的tools拆分为3个不包含单复数的tools
    const replacedToolsListOfFromText = this.getReplacedTools(toolsOfFromText, pluralToolIndex);
    const replacedToolsListOfToText = this.getReplacedTools(toolsOfToText, this.findPluralToolIndex(toolsOfToText));
    const { plural } = toolsOfFromText[pluralToolIndex].value; // 单复数的变量名

    // 返回拆分后的3个词条，每个词条里已不在包含单复数，只有纯文本或插值
    return [
      {
        ...transItem,
        pluralProperty: {
          plural,
          count: '=0',
        },
        toolsOfFromText: replacedToolsListOfFromText[0],
        toolsOfToText: replacedToolsListOfToText[0],
      },
      {
        ...transItem,
        pluralProperty: {
          plural,
          count: '=1',
        },
        toolsOfFromText: replacedToolsListOfFromText[1],
        toolsOfToText: replacedToolsListOfToText[1],
      },
      {
        ...transItem,
        pluralProperty: {
          plural,
          count: 'other',
        },
        toolsOfFromText: replacedToolsListOfFromText[2],
        toolsOfToText: replacedToolsListOfToText[2],
      },
    ];
  },
  /**
   * 将一个包含单复数的tools拆分为3个不包含单复数的tools
   *
   * @author liubin.frontend
   * @param {any[]} tools
   * @param {number} pluralToolIndex 单复数tool在整个数组中的索引
   * @returns 3个不包含单复数的tools
   */
  getReplacedTools(tools, pluralToolIndex) {
    const cloneTools1 = tools.slice();
    const cloneTools2 = tools.slice();
    const cloneTools3 = tools.slice();

    const pluralTool = tools[pluralToolIndex]; // 1个单复数tool
    const decomposeedPluralTools = this.decomposePluralTool(pluralTool); // 3个不包含单复数的tool

    cloneTools1[pluralToolIndex] = decomposeedPluralTools[0]; // 替换掉里面的单复数tool
    cloneTools2[pluralToolIndex] = decomposeedPluralTools[1];
    cloneTools3[pluralToolIndex] = decomposeedPluralTools[2];

    return [cloneTools1, cloneTools2, cloneTools3];
  },
  /**
   * 分解一个PluralTool，拿到其中=0的文本、=1的文本以及other文本，最后组成3个纯文本tool
   *
   * @author liubin.frontend
   * @param {*} pluralTool
   * @returns 一个3个元素的纯文本tool数组，第一个包含=0的文本、第二个包含=1的文本， 第三个包含other文本
   */
  decomposePluralTool(pluralTool) {
    const { zero, one, other } = pluralTool.value;

    return [
      translateTool.generatePlainTextTool({
        plainText: zero,
        composeText: zero,
      }),
      translateTool.generatePlainTextTool({
        plainText: one,
        composeText: one,
      }),
      translateTool.generatePlainTextTool({
        plainText: other,
        composeText: other,
      }),
    ];
  },
  /**
   * 合并翻译词条，因为普通模式下的单复数会拆成多条，但store中的数据还是一条。
   * 发布的时候，需要把拆分的多条单复数再合并为一个整体。
   *
   * @example
   * "Hello world"
   *  "You have no messages"
   *  "You have 1 message"
   *  "You have # messages"
   * 会被合并成
   * "Hello world"
   * "You have {n, plural, =0{no messages} =1{ 1 message} other{# messages}}."
   *
   * @author liubin.frontend
   * @param { {path:string,pluralProperty?:{plural:string,count:string},toolsOfFromText:any[], toolsOfToText:any[]}[] } transItems 词条列表
   * @param { {plural:string,indexes:number[]} } pluralRecordCache 记录每一个单复数词条被分散到整个transItems中的哪些索引,它负责保证分散到的位置是连续的，并且zero对应的是索引最小的那个
   */
  mergeTransItems(transItems, pluralRecordCache) {
    const mergedTransItems = transItems.slice();
    const itemsNeedDelete = []; // 所以需要被删除的transitem索引
    /**
     * 思路： pluralRecordCache会记录每个单复数词条p被分散到整个列表的哪些位置，
     * 应该来说会被拆分成3条翻译记录，分别是：为0时的纯文本翻译text0、为1时的纯文本翻译text1、other时的(可能带插值)的文本text_other。
     * 我们需要把这3条翻译整合成一条，最终的格式会是{p, plural, =0{text0} =1{text1} other{text_other} }
     *
     * 需要注意的是： 原文本和目标文本会联动的一起拆分、一起合并
     */
    Object.keys(pluralRecordCache).forEach((path) => {
      // indexes的元素应该是连续的，并且
      // indexes[0]为zero对应的拆分词条、indexes[1]为one对应的拆分词条、indexes[2]为other对应的拆分词条
      const { indexes, plural } = pluralRecordCache[path];
      const splitedPluralTransItems = indexes.map(index => transItems[index]); // 单复数词条被打散的后的纯文本词条
      const zeroTransItem = splitedPluralTransItems[0];
      const oneTransItem = splitedPluralTransItems[1];
      const otherTransItem = splitedPluralTransItems[2];
      // TODO: 这些逻辑有重复代码，提取到外部
      // 得到整个翻译词条的源翻译文本
      const zeroCombinedTextOfFromTextTools = this.parseToolsToPlainText(zeroTransItem.toolsOfFromText); // 整条翻译当做zero的部分
      const oneCombinedTextOfFromTextTools = this.parseToolsToPlainText(oneTransItem.toolsOfFromText);
      const otherCombinedTextOfFromTextTools = this.parseToolsToPlainText(otherTransItem.toolsOfFromText);

      // 得到整个翻译词条的目标翻译文本
      const zeroCombinedTextOfToTextTools = this.parseToolsToPlainText(zeroTransItem.toolsOfToText);
      const oneCombinedTextOfToTextTools = this.parseToolsToPlainText(oneTransItem.toolsOfToText);
      const otherCombinedTextOfToTextTools = this.parseToolsToPlainText(otherTransItem.toolsOfToText);

      // 拆分的3个来源文本tools，合并成一个大的plural tool
      const combinedPluralToolOfFromText = translateTool.generatePluralTool({
        plural,
        zero: zeroCombinedTextOfFromTextTools,
        one: oneCombinedTextOfFromTextTools,
        other: otherCombinedTextOfFromTextTools,
        composeText: composeTextUtil.pluralTool(
          plural,
          zeroCombinedTextOfFromTextTools,
          oneCombinedTextOfFromTextTools,
          otherCombinedTextOfFromTextTools,
        ),
      });

      // 拆分的3个目标文本tools，合并成一个大的plural tool
      const combinedPluralToolOfToText = translateTool.generatePluralTool({
        plural,
        zero: zeroCombinedTextOfToTextTools,
        one: oneCombinedTextOfToTextTools,
        other: otherCombinedTextOfToTextTools,
        composeText: composeTextUtil.pluralTool(plural, zeroCombinedTextOfToTextTools, oneCombinedTextOfToTextTools, otherCombinedTextOfToTextTools),
      });

      // 3个transitem合并后的一个transitem
      const mergedTransItem = {
        path: zeroTransItem.path,
        pluralProperty: null,
        toolsOfFromText: [combinedPluralToolOfFromText],
        toolsOfToText: [combinedPluralToolOfToText],
      };

      itemsNeedDelete.push({
        indexes, // 需要被删掉的item对应的索引
        mergedTransItem, // 删除这些items时，再在那里塞进去的合并后item
      });
    });

    itemsNeedDelete.sort((left, right) => right.indexes[0] - left.indexes[0]); // 降序,会改变原数组
    itemsNeedDelete.forEach(item => mergedTransItems.splice(item.indexes[0], 3, item.mergedTransItem)); // 删掉拆分的3个再塞入合并的那个
  },

  parseToolsToPlainText(tools) {
    return tools.reduce((result, tool) => result + tool.value.composeText, '');
  },
};

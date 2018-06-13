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
   *
   * @example
   * "You have {n, plural, =0{no messages} =1{ 1 message} other{# messages}}."  =>
   *  "You have no messages"
   *  "You have 1 message"
   *  "You have # messages"
   *
   * @author liubin.frontend
   * @param {any[]} tools
   * @returns
   */
  trySplitPluralTools(tools) {
    const pluralToolIndex = this.findPluralToolIndex(tools);
    if (pluralToolIndex === -1) {
      return [
        {
          plural: undefined,
          tools,
        },
      ];
    }

    const cloneTools1 = tools.slice();
    const cloneTools2 = tools.slice();
    const cloneTools3 = tools.slice();
    const pluralTool = tools[pluralToolIndex];
    const splitedPluralTools = this.doSplitPluralTool(pluralTool);
    cloneTools1[pluralToolIndex] = splitedPluralTools[0];
    cloneTools2[pluralToolIndex] = splitedPluralTools[1];
    cloneTools3[pluralToolIndex] = splitedPluralTools[2];

    return [
      {
        plural: pluralTool.value.plural,
        count: '=0',
        tools: cloneTools1,
      },
      {
        plural: pluralTool.value.plural,
        count: '=1',
        tools: cloneTools2,
      },
      {
        plural: pluralTool.value.plural,
        count: 'other',
        tools: cloneTools3,
      },
    ];
  },

  doSplitPluralTool(pluralTool) {
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
   * @param { {path:string,pluralProperty?:{plural:string,count:string},tools:any[]}[] } transItems 词条列表
   * @param { {plural:string,indexes:number[]} } pluralRecordCache 记录每一个plural被分散到整个transItems中的哪些索引
   */
  mergeTransItems(transItems, pluralRecordCache) {
    Object.keys(pluralRecordCache).forEach((plural) => {
      const indexes = pluralRecordCache[plural];
      const splitedPluralTransItems = indexes.map(index => transItems[index]); // 单复数词条被打散的后的纯文本词条
      const zero = splitedPluralTransItems.find(item => item.pluralProperty.count === '=0');
    });
  },
};

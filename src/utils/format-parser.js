/* eslint-disable max-len */
import translateTool from '../utils/translate-tool';
import composeTextUtil from '../utils/compose-text-util';

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
    const generaor = readonly
      ? translateTool.generateReadonlyPlainTextTool
      : translateTool.generatePlainTextTool;
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
    const generaor = readonly
      ? translateTool.generateReadonlyVaribaleTool
      : translateTool.generateVaribaleTool;
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

    const generaor = readonly
      ? translateTool.generateReadonlyPluralTool
      : translateTool.generatePluralTool;

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
};

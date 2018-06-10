import TOOL_NAME from './tool-name';

/**
 * 各种TOOL的数据模板
 */
export default {
  PLAIN_TEXT: {
    component: TOOL_NAME.PLAIN_TEXT_TOOL,
    value: {
      plainText: '',
      composeText: '', // 用于在计算拼接词条时统一用的属性
      readonly: false, // 是否只读
    },
  },
  VARIABLE: {
    component: TOOL_NAME.VARIABLE_TOOL,
    value: {
      variableName: '',
      showDialog: true,
      isNew: true,
      composeText: '',
      readonly: false,
    },
  },
  PLURAL: {
    component: TOOL_NAME.PLURAL_TOOL,
    value: {
      plural: '',
      zero: '',
      one: '',
      other: '',
      showDialog: true,
      isNew: true,
      composeText: '',
      readonly: false,
    },
  },
};

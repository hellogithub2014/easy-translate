import MessageFormat from 'messageformat';

export default {
  computed: {
    formatterWithFromLocale() {
      const mf = new MessageFormat(this.fromLocale);
      mf.setIntlSupport(true);
      return mf;
    },
    formatterWithToLocale() {
      const mf = new MessageFormat(this.toLocale);
      mf.setIntlSupport(true);
      return mf;
    },
  },
  methods: {
    isValidFormat(formatter, text, locale) {
      try {
        formatter.compile(text, locale);
        return true;
      } catch (e) {
        return false;
      }
    },
  },
};

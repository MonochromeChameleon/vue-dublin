import marked from 'marked';

const mapValues = (obj, mapper) =>
  Object.entries(obj).reduce((acc, [k, v]) => Object.assign({}, acc, { [k]: mapper(v) }), {});

const applyrx = (rx, content, def) => (rx.test(content) ? rx.exec(content)[1].trim() : def);

const parsePageContent = ({ content, inclusions }) => {
  const parseContent = it => {
    const comment = applyrx(/^<!---(.+)--->/, it, '');
    const hide = applyrx(/hide:\s?(\d)/, comment);
    const classname = applyrx(/class:\s?([\w|\s]+)/, comment);
    const include = applyrx(/include:\s(\w+)/, comment);

    const text = [it, inclusions[include]].filter(c => c).join('\n\n');

    return { text, hide, classname };
  };

  const splitContent = (it = '') => it.split(/\n\n\n/);
  const splitAndParse = it => splitContent(it).map(parseContent);

  return mapValues(content, splitAndParse);
};

const pageMaker = content => {
  return {
    props: {
      section: {
        type: Number,
        default: 0
      },
      sections: {
        type: Number,
        default: 0
      }
    },
    render(createElement) {
      const contents = this.visibleContent.map(vc =>
        createElement('div', {
          class: `content ${vc.classname || ''}`,
          domProps: { innerHTML: marked(vc.text) }
        })
      );

      return createElement('section', {}, contents);
    },
    methods: {
      isShown(ix) {
        const contentEntry = content[ix];
        const isShownYet = (contentEntry.show || ix) <= this.section;
        const isHiddenNow = (contentEntry.hide || Infinity) <= this.section;

        return isShownYet && !isHiddenNow;
      }
    },
    computed: {
      visibleContent() {
        return content.filter((it, ix) => this.isShown(ix));
      }
    }
  };
};

const toRoute = ([name, pageContent]) => ({
  name,
  path: `/${name === 'blank' ? '' : name}/:section?`,
  props: route => ({
    section: Number(route.params.section) || 0,
    sections: pageContent.length
  }),
  component: pageMaker(pageContent)
});

export default content => Object.entries(parsePageContent(content)).map(toRoute);

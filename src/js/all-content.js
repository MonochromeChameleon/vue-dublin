import intro from '../content/intro.md';
import me from '../content/me.md';
import oldBrowsers from '../content/old-browsers.md';
import renderingEngines from '../content/rendering-engines.md';
import vue from '../content/vue.md';
import frameworks from '../content/frameworks.md';
import oneLastThing from '../content/one-last-thing.md';
import end from '../content/end.md';

import browsers from '../content/_browsers.md';

const inclusions = {
  browsers
};

const content = {
  blank: '',
  intro,
  me,
  oldBrowsers,
  renderingEngines,
  vue,
  frameworks,
  oneLastThing,
  end
};

export default {
  content,
  inclusions
};

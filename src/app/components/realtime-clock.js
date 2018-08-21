import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  classNames: ['display-4'],
  hour: computed('clock.hour', function () {
    return this.get('clock.hour')%12;
  }),
  minute: computed('clock.minute', function () {
    let digit = this.get('clock.minute').toString();
    return digit.length < 2?'0'+digit:digit;
  }),
  second: computed('clock.second', function () {
    let digit = this.get('clock.second').toString();
    return digit.length < 2?'0'+digit:digit;
  })
});

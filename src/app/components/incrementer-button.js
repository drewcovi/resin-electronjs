import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn','btn-link','temp-control'],
  click(){
    let targetTemp = this.get('targetTemp')
    this.set('targetTemp', targetTemp+1);
  }
});

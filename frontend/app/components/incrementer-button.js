import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn','btn-link'],
  inverted: false,
  click(){
    if(this.get('inverted')){

      alert('decrement')
    }else{
      alert('increment')
    }
  },
  init(){
    this._super();
    let classNames = this.get('classNames').toArray()
    console.log(classNames)
    // if(this.get('inverted')){
    //   this.set('classNames', classNames.push('rotate-180'));
    // }
  }
});

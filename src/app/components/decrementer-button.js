import IncrementerButton from './incrementer-button';

export default IncrementerButton.extend({
  layoutName: 'components/incrementer-button',
  classNames: ['inverted'],
  click(){
    let targetTemp = this.get('targetTemp')
    this.set('targetTemp', targetTemp-1);
  }
});

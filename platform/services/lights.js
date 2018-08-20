const ws281x    = require('rpi-ws281x-native');
const options = {
  dma: 10,
  freq: 800000,
  gpio: 18,
  invert: false,
  brightness: 255,
  stripType: ws281x.stripType.WS2811_RGB
};
const util                = require('util');
const bleno               = require('bleno');
const hsl                 = require('hsl-to-hex');
const BlenoCharacteristic = bleno.Characteristic;
const NUM_LEDS            = 4;
const channels            = ws281x(NUM_LEDS, options);
const pixelData           = channels.array;
let Animation             = null;
let animation             = null;
var hold;

function reset()
{
  ws281x.reset();
  clearTimeout(hold);
  clearInterval(animation);
}




class Animate{
  constructor(pixels) {
    reset();
    this.animation = null;
    this.pixels = pixels;
    this.countdown = null;
    this.pixels.forEach((pixel)=>{
      pixel.animation = setInterval( ()=>{
        pixels.forEach( (pixel, index)=>{
          // console.log(_this, this, _this['pulse'], _this.pulse, pixel.pattern);
          this[pixel.pattern](pixel, index);
        })
        var output = pixels.map( (pixel)=>{
          return pixel.output;
        })
        pixelData.forEach( (row, index)=>{
          pixelData[index] = output[index];
        })
        ws281x.render();
      }, 1000 / 60);

    })
    if(Animation){
      Animation.destroy();
    }
    Animation = this;
  }
  destroy(){
    // console.log('destroying', this);
    this.pixels.forEach((pixel)=>{
      clearInterval(pixel.animation);
    });
    ws281x.reset();
  }
  runningLights(pixel, index){
    let subset = Animation.pixels.filter( (pixel)=>{
      return pixel.pattern === 'runningLights';
    })
    let offset  = subset.indexOf(pixel);
    let total = subset.length;
    this.pulse(pixel, index, offset, total);
  }
  rainbowCycle(pixel, index) {
    let subset      = Animation.pixels.filter( (pixel)=>{
      return pixel.pattern === 'rainbowCycle';
    })
    let offset      = subset.indexOf(pixel);
    let total       = subset.length;
    let brightness  = pixel.brightness || 20;
    let speed       = pixel.speed/10 || 2;
    let step        = pixel.step || 0;

		let color = colorWheel(((offset / total * 256)+step)%255);


		pixel.step=step+speed;
    pixel.output = color;
    this.pixels[index] = pixel
  }
  pulse(pixel, index, offset=0, total = 1){
    // console.log('pulse!')
    let pi          = Math.PI;
    let color       = pixel.color || ["0xff0000"];
    let speed       = pixel.speed || 25;
    let brightness  = pixel.brightness || 50;
    let limit       = pixel.limit || 0;
    let pause       = pixel.pause || 0;
    let start       = pixel.start || 180;
    let shift       = pi-2*pi*((start-90)/360);
    let min         = pixel.min/100 || 0;
    let steps       = 310-speed/100*300;
    let step        = pixel.step || 0;
    let max         = pixel.max/100 || 100;
    let iteration   = 0;

    if(offset){
      offset = parseInt(steps/total*offset);
    }

    let amp         = Math.sin(((step+offset)%steps/steps*pi*2)-shift)/2+.5;
    let countdown   = pixel.countdown;
    amp = Math.min(Math.max(min, amp), max);
    let rgb         = hex2rgb(color);
    color           = rgb2hex([0, rgb[0]*amp,rgb[1]*amp,rgb[2]*amp]);


    if(pause){
      if (!countdown){
        pixel.step    = (step+1)%steps;
        if(!pixel.step){
          pixel.countdown = setTimeout(()=>{
            pixel.countdown = null;
            pixel.step = 1;
          },pause*1000);
        }else{
          pixel.output    = color;
          pixel.amp       = amp;
        }
      }
    }else{
      pixel.step    = (step+1)%steps;
      pixel.output    = color;
      pixel.amp       = amp;
    }

    if(!step){
      iteration++;
      if(limit && iteration >= limit){
        clearTimeout(animation);
      }
      if(pause){
        if(amp <= .01){
          pixel.output = '0x000000';
        }

      }
    }
    this.pixels[index] = pixel;
  }
  solid(pixel, index){
    pixel.output = pixel.color;
    this.pixels[index] = pixel;
  }
}

function colorWheel(pos)
{
		if (pos < 85) {
			return rgb2hex([0, 255 - pos * 3, 0, pos * 3]);
		}
		else if (pos < 170) {
			pos -= 85;
			return rgb2hex([0, 0, pos * 3, 255 - pos * 3]); }
		else {
			pos -= 170;
			return rgb2hex([0, pos * 3, 255 - pos * 3, 0]); }
}

function rgb2hex(rgb)
{
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "0x" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex2rgb(hex)
{
  var r = hex >> 16;
  var g = (hex & 0x00FF00) >> 8;
  var b = hex & 0x0000FF;
  return [r, g, b];
}
module.exports.methods = ws281x;
module.exports.off = function(){ new Animate([{pattern: 'solid', color: '0x000000'},{pattern: 'solid', color: '0x000000'},{pattern: 'solid', color: '0x000000'},{pattern: 'solid', color: '0x000000'}]);}
module.exports.animate = Animate;

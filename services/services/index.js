process.env['BLENO_DEVICE_NAME'] = 'swiss-army';
const bleno = require('bleno');
const gpio = require('rpi-gpio');
const wifi = require('node-wifi');
const WiFiScanService = bleno.PrimaryService;
const DeviceInformationService = bleno.PrimaryService;
const GenericAttributeService = bleno.PrimaryService;
const DeviceStatusService = bleno.PrimaryService;
const APDetailsCharacteristic = require('./ap-details-characteristic');
const DeviceNameCharacteristic = require('./device-name-characteristic');
const ModelNumberCharacteristic = require('./model-number-characteristic');
const ConnectedSSIDCharacteristic = require('./connected-ssid-characteristic');
const SerialNumberCharacteristic = require('./serial-number-characteristic');
const LEDPatternCharacteristic = require('./led-pattern-characteristic');
const TankSizeCharactersitic = require('./tank-size-characteristic');
const EnergyRatingCharacteristic = require('./energy-rating-characteristic');
const CapacityCharacteristic = require('./capacity-characteristic');
const lights = require('./lights');
const Animation = lights.animate;
let rssiTracker = null;
let initialRSSI = null;
let confidence = 0;
let average = [];
let lastTrend = null;
let trendValue = null;

var advertising;
var bleTimeout;
var connected;
var bleStart;
var activePattern = null;
var bleWait = 3000;
var clickTime = null;

const patterns = [

	// power only
	[{
		pattern: 'pulse',
		color: '0x003100',
		start: 180,
		pause: 10,
		speed: 99,
		min: 30
	}],

	// scanning
	[{
		pattern: 'solid',
		color: '0x001600'
	}
	,{
		pattern: 'pulse',
		color: '0x0000ff',
		start: 180,
		pause: .5,
		speed: 80
	}],

	// bluetooth connected power normal
	[{
		pattern: 'solid',
		color: '0x001600'
	}
	,{
		pattern: 'pulse',
		color: '0x000031',
		start: 180,
		pause: 2,
		speed: 99,
		min: 30
	}],

	//reading
	[{
		pattern: 'solid',
		color: '0x001600'
	}
	,{
		pattern: 'pulse',
		color: '0x0000ff',
		start: 180,
		speed: 100
	}],

	// wifi connected power normal
	[{
		pattern: 'pulse',
		color: '0x003100',
		start: 180,
		pause: 10,
		speed: 99,
		min: 30
	}
	,{
		pattern: 'pulse',
		color: '0x000031',
		start: 180,
		pause: 10,
		speed: 99,
		min: 30
	}],

	// attention status wifi fine
	[{
		pattern: 'pulse',
		color: '0x313100',
		start: 180,
		speed: 99,
		max: 80,
		min: 30,
		pause: .5
	}
	,{
		pattern: 'pulse',
		color: '0x000031',
		start: 180,
		pause: 10,
		speed: 99,
		min: 30
	}],

	// critical status wifi fine
	[{
		pattern: 'pulse',
		color: '0x800000',
		start: 180,
		speed: 99,
		max: 100,
		min: 5,
		pause: .5
	}
	,{
		pattern: 'pulse',
		color: '0x000031',
		start: 180,
		pause: 10,
		speed: 99,
		min: 30
	}],

]

function doubleClick(){
	activePattern = ((activePattern || patterns.length) + 1)%patterns.length;
	// console.log(activePattern, patterns[activePattern])
	new Animation(patterns[activePattern]);
}


var lastClick = new Date().getTime();

gpio.on('change', function(channel, value){
	// console.log('Channel ' + channel + ' value is now ' + value);
  if(value){
		clearTimeout(bleTimeout);
		bleStart = (new Date()).getTime();
		bleTimeout = setTimeout(function(){
			bleno.startAdvertising('swiss-army', ['0717']);
		}, bleWait)
  }else{
		// console.log();
		let holdTime = new Date().getTime() - bleStart;
		clickTime = new Date().getTime();
		let clickDuration = clickTime - lastClick;
		lastClick = clickTime;
		if(clickDuration > 100 && clickDuration < 500){
			// console.log('double click');
			doubleClick();
		}
		if(holdTime < bleWait){
			if(advertising){
		    bleno.stopAdvertising();
			}
			if(connected){
		    bleno.disconnect();
			}
			clearTimeout(bleTimeout);
		}
  }
});

gpio.setup(40, gpio.DIR_IN, gpio.EDGE_BOTH, complete);

function complete(err){
  gpio.read(40, function(err, value) {
      if (err) throw err;
      if(value){
        bleno.startAdvertising('swiss-army', ['0717']);
      }
  });
}

lights.methods.reset();

function checkWifi(){
	wifi
    .getCurrentConnections()
    .then((connections)=>{
			if(connections.length){
				new Animation(patterns[4])
			}else{
				powerLights()
			}
		});
}

checkWifi();


bleno.on('wifiConnected', function(){
	new Animation([
  {
		pattern: 'pulse',
		color: '0x00ff00',
		start: 180,
		pause: 4,
		speed: 99,
		min: 30
	}
	,{
		pattern: 'pulse',
		color: '0x0000ff',
		start: 180,
		pause: 4,
		speed: 99,
		min: 30
	}
	]);
})

bleno.on('readRequest', function(){
	new Animation([
	{
		pattern: 'solid',
		color: '0x003100'
	}
	,{
		pattern: 'pulse',
		color: '0x0000ff',
		start: 180,
		speed: 100
	}
	]);
})
bleno.on('readDone', function(){
	new Animation([
	{
		pattern: 'solid',
		color: '0x003100'
	}
	,{
		pattern: 'pulse',
		color: '0x0000ff',
		start: 180,
		pause: 4,
		speed: 99,
		min: 30
	}
]);
})

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    // bleno.startAdvertising('swiss-army', ['0717']);
  } else {
    // bleno.stopAdvertising();
  }
});

bleno.on('advertisingStop', function(error){
	error = error || 'manual disconnect';
	console.log('advertising stopped: '+error)
  advertising = false;
  // lights.patterns.ledOff();
  checkWifi()
	powerLights()
});
function advertiseLights(){
	new Animation([
	{
		pattern: 'solid',
		color: '0x003100'
	}
	,{
		pattern: 'pulse',
		color: '0x0000ff',
		start: 180,
		pause: .5,
		speed: 80
	}
	]);
}
function powerLights(){

	new Animation([{
		pattern: 'pulse',
		color: '0x003100',
		start: 180,
		pause: 4,
		speed: 99,
		min: 30
	}]);
}
function bar(){

}
bleno.on('advertisingStart', function(error) {
  advertising = true;
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  advertiseLights();
  if (!error) {
    bleno.setServices([
			new WiFiScanService({
				uuid: 'fb8c0001-d224-11e4-85a1-0002a5d5c51b',
				characteristics: [
					new APDetailsCharacteristic()
				]
			}),

      new DeviceStatusService({
        uuid: '73746174-0000-1000-8000-00805f9b34fb',
       // uudi: '6c656473-0000-1000-8000-00805f9b34fb',
        characteristics: [
          new LEDPatternCharacteristic()
        ]
      }),

      new GenericAttributeService({
        uuid: '00001801-0000-1000-8000-00805f9b34fb',
        characteristics: [
          new TankSizeCharactersitic(),
          new CapacityCharacteristic(),
          new EnergyRatingCharacteristic(),
        ]
      }),
      new DeviceInformationService({
        uuid: '180A',
        characteristics: [
          new SerialNumberCharacteristic(),
          new ModelNumberCharacteristic(),
          new DeviceNameCharacteristic(),
					new ConnectedSSIDCharacteristic()
        ]
      })
    ]);
  }
});

bleno.on('accept', function(clientAddress) {
		connected = true;
    console.log("Accepted connection from address: " + clientAddress);
    clearInterval(rssiTracker);
    rssiTracker = setInterval(function(){
      bleno.updateRssi();
    },100);
		new Animation([
		{
			pattern: 'solid',
			color: '0x003100'
		}
		,{
			pattern: 'pulse',
			color: '0x0000ff',
			start: 180,
			pause: 4,
			speed: 99,
			min: 30
		}
	]);
});

bleno.on('rssiUpdate', function(rssi) {
  average.splice(0,0,rssi);
  average = average.slice(0,15);
  trendValue = average.reduce( (total, value) => (total+value))/average.length; 
  //console.log(average);
  //console.log(trendValue);
  if(!initialRSSI){
    initialRSSI = rssi;
  }else{
    //console.log('on -> rssiUpdate: ', initialRSSI, rssi, confidence);
    if(trendValue - lastTrend > 0){
      //console.log('closer!');
      confidence++;
    }else if (trendValue - lastTrend < 0){
      //console.log('farther!');
      confidence = Math.max(0, confidence-1);
    }
    //initialRSSI = rssi;
  }
  lastTrend = trendValue;
  if(confidence >= 10){
    console.log('confirmed');
    clearInterval(rssiTracker); 
    confidence = 0;
    average = [];
  }
});

bleno.on('disconnect', function(clientAddress) {
		connected = false;
    console.log("Connection lost from: " + clientAddress);
		// activePattern = null;
		// delete activePattern;

		// lights.methods.reset();
    if(advertising){
      advertiseLights();
    }else{
      powerLights();
    }
}); // Linux only


process.on('SIGINT', function () {
  lights.methods.reset();
  process.nextTick(function () { process.exit(0); });
});

process.on('SIGTERM', function () {
  lights.methods.reset();
  process.nextTick(function () { process.exit(0); });
});

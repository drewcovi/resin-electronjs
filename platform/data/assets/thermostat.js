"use strict";



define('thermostat/app', ['exports', 'thermostat/resolver', 'ember-load-initializers', 'thermostat/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('thermostat/components/incrementer-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'button',
    classNames: ['btn', 'btn-link'],
    inverted: false,
    click() {
      if (this.get('inverted')) {

        alert('decrement');
      } else {
        alert('increment');
      }
    },
    init() {
      this._super();
      let classNames = this.get('classNames').toArray();
      console.log(classNames);
      // if(this.get('inverted')){
      //   this.set('classNames', classNames.push('rotate-180'));
      // }
    }
  });
});
define('thermostat/components/realtime-clock', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNames: ['display-4'],
    hour: Ember.computed('clock.hour', function () {
      return this.get('clock.hour') % 12;
    }),
    minute: Ember.computed('clock.minute', function () {
      let digit = this.get('clock.minute').toString();
      return digit.length < 2 ? '0' + digit : digit;
    }),
    second: Ember.computed('clock.second', function () {
      let digit = this.get('clock.second').toString();
      return digit.length < 2 ? '0' + digit : digit;
    })
  });
});
define('thermostat/components/temperature-control', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    currentTemp: 76
  });
});
define('thermostat/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('thermostat/helpers/app-version', ['exports', 'thermostat/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;

    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('thermostat/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('thermostat/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('thermostat/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'thermostat/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let name, version;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('thermostat/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('thermostat/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('thermostat/initializers/export-application-global', ['exports', 'thermostat/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define("thermostat/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('thermostat/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('thermostat/router', ['exports', 'thermostat/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {});

  exports.default = Router;
});
define('thermostat/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("thermostat/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Btole9A7", "block": "{\"symbols\":[],\"statements\":[[1,[20,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "thermostat/templates/application.hbs" } });
});
define("thermostat/templates/components/incrementer-button", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "N6i+HIRb", "block": "{\"symbols\":[],\"statements\":[[6,\"svg\"],[10,\"width\",\"63px\"],[10,\"height\",\"63px\"],[10,\"viewBox\",\"0 0 63 63\"],[10,\"version\",\"1.1\"],[10,\"xmlns\",\"http://www.w3.org/2000/svg\",\"http://www.w3.org/2000/xmlns/\"],[10,\"xmlns:xlink\",\"http://www.w3.org/1999/xlink\",\"http://www.w3.org/2000/xmlns/\"],[8],[0,\"\\n  \"],[6,\"ellipse\"],[10,\"id\",\"Oval-Copy-3\"],[10,\"fill\",\"#ffffff\"],[10,\"stroke\",\"#BCBCBC\"],[10,\"stroke-width\",\"2\"],[10,\"opacity\",\"0.43\"],[10,\"cx\",\"31.4361902\"],[10,\"cy\",\"31.3806661\"],[10,\"rx\",\"30.4361902\"],[10,\"ry\",\"30.3806661\"],[8],[9],[0,\"\\n  \"],[6,\"polygon\"],[10,\"id\",\"Page-1-Copy-3\"],[10,\"fill\",\"#000000\"],[10,\"fill-rule\",\"nonzero\"],[10,\"transform\",\"translate(33.007192, 28.763835) rotate(-360.000000) translate(-33.007192, -28.763835) \"],[10,\"points\",\"23.6353553 36.9953185 20.6553781 34.3270352 33.0071921 20.5323515 45.3590061 34.3270352 42.3790289 36.9953185 33.0071921 26.5287163\"],[8],[9],[0,\"\\n\"],[9]],\"hasEval\":false}", "meta": { "moduleName": "thermostat/templates/components/incrementer-button.hbs" } });
});
define("thermostat/templates/components/realtime-clock", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "cM2DyNiW", "block": "{\"symbols\":[],\"statements\":[[1,[20,\"hour\"],false],[0,\":\"],[1,[20,\"minute\"],false],[0,\":\"],[1,[20,\"second\"],false]],\"hasEval\":false}", "meta": { "moduleName": "thermostat/templates/components/realtime-clock.hbs" } });
});
define("thermostat/templates/components/temperature-control", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NWdaisjN", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[10,\"class\",\"display-1 text-center\"],[8],[0,\"\\n  \"],[1,[20,\"currentTemp\"],false],[0,\"\\n\"],[9],[0,\"\\n\"],[6,\"div\"],[10,\"class\",\"align-items-center\"],[8],[0,\"\\n\"],[1,[26,\"incrementer-button\",null,[[\"inverted\"],[\"true\"]]],false],[0,\"\\n\"],[1,[20,\"incrementer-button\"],false],[0,\"\\n\"],[9]],\"hasEval\":false}", "meta": { "moduleName": "thermostat/templates/components/temperature-control.hbs" } });
});
define("thermostat/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "b73fYj7e", "block": "{\"symbols\":[],\"statements\":[[1,[26,\"realtime-clock\",null,[[\"class\"],[\"text-center\"]]],false],[0,\"\\n\"],[1,[20,\"temperature-control\"],false]],\"hasEval\":false}", "meta": { "moduleName": "thermostat/templates/index.hbs" } });
});


define('thermostat/config/environment', [], function() {
  var prefix = 'thermostat';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("thermostat/app")["default"].create({"name":"thermostat","version":"0.0.0+33a751db"});
}
//# sourceMappingURL=thermostat.map

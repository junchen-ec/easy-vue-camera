(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@mdi/font/css/materialdesignicons.css'), require('uuid'), require('easy-js-camera')) :
    typeof define === 'function' && define.amd ? define(['exports', '@mdi/font/css/materialdesignicons.css', 'uuid', 'easy-js-camera'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EasyCamera = {}, null, global.uuid, global.Camera));
}(this, (function (exports, materialdesignicons_css, uuid, Camera) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Camera__default = /*#__PURE__*/_interopDefaultLegacy(Camera);

    //

    var script = {
        computed: {
            hasHeader: function hasHeader() {
                return typeof this.$slots.header !== 'undefined' && this.$slots.header !== null;
            },
            multiDevice: function multiDevice() {
                if(!this.camera) { return false; }
                return this.camera.devices.length > 1;
            }
        },
        data: function data() {
            return {
                camera: null,
                canvasElementId: ("canvas-" + (uuid.v4().replace(/-/g, ''))),
                canvas: null,
                picture: null,
                pictureDataUrl: null,
                switching: false,
                video: null,
                videoElementId: ("video-" + (uuid.v4().replace(/-/g, ''))),
                visibleMask: false,
            }
        },
        methods: {
            approve: function approve() {
                this.$emit('input', this.picture);
                this.$emit('approve', this.picture);
            },
            close: function close() {
                this.stop();
                this.$emit('close');
            },
            snapAsBlob: function snapAsBlob() {
                var this$1 = this;

                if(!this.camera) {
                    console.error('Camera not found to take a picture');
                    return;
                }            
                return new Promise(function (resolve) {
                    this$1.camera.snapAsBlob()
                        .then(function (picture) {
                            this$1.picture = picture;
                            resolve(picture);
                        });
                });
            }, 
            snapAsDataUrl: function snapAsDataUrl() {
                if(!this.camera) {
                    console.error('Camera not found to take a picture');
                    return;
                }
                this.picture = this.camera.snapAsDataUrl();
                this.stop();
                if(!this.mustApprove) {
                    this.$emit('input', this.picture);
                }
                return this.picture;
            },
            start: function start() {
                var this$1 = this;

                if(this.camera) {
                    this.picture = null;
                    this.$emit('input', null);
                    this.$emit('loading', true);
                    this.camera.start()
                        .finally(function () { return this$1.$emit('loading', false); });
                    return;
                }
                this.video = document.getElementById(this.videoElementId);
                this.canvas = document.getElementById(this.canvasElementId);
                return new Promise(function (resolve) {
                    Camera__default['default'].tryInvokePermission(this$1.video, this$1.canvas)
                        .then(function (camera) {
                            this$1.camera = camera;
                            resolve(camera);
                        });
                });
            },
            stop: function stop() {
                if(!this.camera) {
                    return;
                }
                this.camera.stop();
            },
            switchCamera: function switchCamera(tryAgain) {
                var this$1 = this;
                if ( tryAgain === void 0 ) tryAgain = false;

                if(this.switching && !tryAgain) { return; }
                if(!this.camera) {
                    console.error('No camera found to switch...');
                    return;
                }
                this.switching = true;
                return new Promise(function (resolve, reject) {
                    this$1.camera.switch(tryAgain)
                        .then(function () {
                            this$1.switching = false;
                            resolve();
                        })
                        .catch(function () {
                            if(!tryAgain) {
                                this$1.switchCamera(true);
                            } else {
                                this$1.switching = false;
                                reject();
                            }
                        });
                });
            }
        },
        mounted: function mounted() {
            if(this.startOnMounted) {
                this.$emit('loading', true);
                this.start()
                    .then(function (camera) {
                        if(camera) {
                            camera.setVideoConstraints({facingMode:'environment'});
                            camera.start();
                        }
                    })
                    .finally(this.$emit('loading', false));
            }
        },
        name: 'fullscreen-view-camera',
        props: {
            fullscreenZIndex: Number,
            mustApprove: Boolean,
            overlayMask: String,
            startOnMounted: Boolean,
            visibleOverlay: Boolean,
        },
        watch: {
            picture: function picture() {
                var this$1 = this;

                if(!this.picture) { this.pictureDataUrl = null; }
                if(!(this.picture instanceof Blob)) {
                    this.pictureDataUrl = this.picture;
                } else {
                    var reader = new FileReader();
                    reader.readAsDataURL(this.picture);
                    reader.onload = function () {
                        this$1.pictureDataUrl = reader.result;
                    };
                }
            }
        }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        var options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        var hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                var originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                var existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    var isOldIE = typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
        return function (id, style) { return addStyle(id, style); };
    }
    var HEAD;
    var styles = {};
    function addStyle(id, css) {
        var group = isOldIE ? css.media || 'default' : id;
        var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
        if (!style.ids.has(id)) {
            style.ids.add(id);
            var code = css.source;
            if (css.map) {
                // https://developer.chrome.com/devtools/docs/javascript-debugging
                // this makes source maps inside style tags work properly in Chrome
                code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
                // http://stackoverflow.com/a/26603875
                code +=
                    '\n/*# sourceMappingURL=data:application/json;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                        ' */';
            }
            if (!style.element) {
                style.element = document.createElement('style');
                style.element.type = 'text/css';
                if (css.media)
                    { style.element.setAttribute('media', css.media); }
                if (HEAD === undefined) {
                    HEAD = document.head || document.getElementsByTagName('head')[0];
                }
                HEAD.appendChild(style.element);
            }
            if ('styleSheet' in style.element) {
                style.styles.push(code);
                style.element.styleSheet.cssText = style.styles
                    .filter(Boolean)
                    .join('\n');
            }
            else {
                var index = style.ids.size - 1;
                var textNode = document.createTextNode(code);
                var nodes = style.element.childNodes;
                if (nodes[index])
                    { style.element.removeChild(nodes[index]); }
                if (nodes.length)
                    { style.element.insertBefore(textNode, nodes[index]); }
                else
                    { style.element.appendChild(textNode); }
            }
        }
    }

    /* script */
    var __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fullscreen-camera",
          style: { "z-index": _vm.fullscreenZIndex }
        },
        [
          _c("div", { staticClass: "camera-stack" }, [
            _c(
              "div",
              { staticClass: "camera-stack-header" },
              [
                _vm._t("header"),
                _vm._v(" "),
                !_vm.hasHeader
                  ? _c(
                      "a",
                      {
                        staticClass: "close-button",
                        attrs: { role: "button" },
                        on: { click: _vm.close }
                      },
                      [_vm._v("×")]
                    )
                  : _vm._e()
              ],
              2
            ),
            _vm._v(" "),
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: !_vm.picture,
                    expression: "!picture"
                  }
                ],
                staticClass: "video-wrapper"
              },
              [
                _c("video", {
                  attrs: { id: _vm.videoElementId, autoplay: "", playsinline: "" }
                }),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass: "overlay-mask",
                    class: { "visible-overlay": _vm.visibleOverlay }
                  },
                  [
                    _vm.visibleMask
                      ? _c("img", { attrs: { src: _vm.overlayMask } })
                      : _vm._e()
                  ]
                )
              ]
            ),
            _vm._v(" "),
            _c("canvas", {
              staticStyle: { display: "none" },
              attrs: { id: _vm.canvasElementId }
            }),
            _vm._v(" "),
            _c("div", {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.picture,
                  expression: "picture"
                }
              ],
              staticClass: "camera-snap",
              style: { "background-image": "url(" + _vm.pictureDataUrl + ")" }
            }),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "camera-stack-controls",
                class: { background: !!_vm.picture }
              },
              [
                _c("div", { staticClass: "camera-stack-controls-wrapper" }, [
                  _c("div", { staticClass: "control-slot" }, [
                    _vm.overlayMask && !_vm.picture
                      ? _c(
                          "a",
                          {
                            staticClass: "secondary-button",
                            attrs: { role: "button" },
                            on: {
                              click: function($event) {
                                _vm.visibleMask = !_vm.visibleMask;
                              }
                            }
                          },
                          [_c("i", { staticClass: "mdi mdi-grid-large" })]
                        )
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "control-slot" }, [
                    !_vm.picture
                      ? _c(
                          "a",
                          {
                            attrs: { role: "button" },
                            on: {
                              click: function($event) {
                                return _vm.$emit("snap")
                              }
                            }
                          },
                          [_c("i", { staticClass: "mdi mdi-circle" })]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.picture && _vm.mustApprove
                      ? _c(
                          "a",
                          { attrs: { role: "button" }, on: { click: _vm.approve } },
                          [_c("i", { staticClass: "mdi mdi-check" })]
                        )
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "control-slot" }, [
                    _vm.multiDevice && !_vm.picture
                      ? _c(
                          "a",
                          {
                            staticClass: "secondary-button",
                            attrs: { disabled: _vm.switching, role: "button" },
                            on: {
                              click: function($event) {
                                return _vm.switchCamera(false)
                              }
                            }
                          },
                          [_c("i", { staticClass: "mdi mdi-camera-switch" })]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.picture
                      ? _c(
                          "a",
                          {
                            staticClass: "secondary-button",
                            attrs: { role: "button" },
                            on: { click: _vm.start }
                          },
                          [
                            _c("i", {
                              staticClass: "mdi mdi-camera-retake-outline"
                            })
                          ]
                        )
                      : _vm._e()
                  ])
                ])
              ]
            )
          ])
        ]
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      var __vue_inject_styles__ = function (inject) {
        if (!inject) { return }
        inject("data-v-5dd7341e_0", { source: ".fullscreen-camera[data-v-5dd7341e] {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.fullscreen-camera .camera-stack[data-v-5dd7341e] {\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  height: 100%;\n}\n.fullscreen-camera .camera-stack .camera-stack-header a.close-button[data-v-5dd7341e] {\n  position: fixed;\n  top: 5px;\n  right: 15px;\n  color: #fff;\n  font-family: Roboto, Tahoma;\n  font-size: 2.5rem;\n  line-height: 40px;\n  font-weight: 300 !important;\n  z-index: 100;\n}\n.fullscreen-camera .camera-stack .video-wrapper[data-v-5dd7341e] {\n  height: 100%;\n  width: 100%;\n  align-self: stretch;\n  align-items: center;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.fullscreen-camera .camera-stack .video-wrapper video[data-v-5dd7341e] {\n  object-fit: cover;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n}\n.fullscreen-camera .camera-stack .video-wrapper .overlay-mask[data-v-5dd7341e] {\n  max-width: 50vh;\n  max-height: 50vh;\n  width: 100%;\n  height: 100%;\n  margin-top: 10vh;\n}\n.fullscreen-camera .camera-stack .video-wrapper .overlay-mask.visible-overlay[data-v-5dd7341e] {\n  box-shadow: 0px 0px 2000px 2000px rgba(0, 0, 0, 0.8);\n}\n.fullscreen-camera .camera-stack .video-wrapper .overlay-mask img[data-v-5dd7341e] {\n  width: 100%;\n}\n.fullscreen-camera .camera-stack .camera-snap[data-v-5dd7341e] {\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  width: 100%;\n  height: 100%;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls[data-v-5dd7341e] {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  position: fixed;\n  bottom: 0;\n  padding: 5vh 0px;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls.background[data-v-5dd7341e] {\n  background-color: rgba(0, 0, 0, 0.8) !important;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper[data-v-5dd7341e] {\n  max-width: 500px;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  margin: 0 auto;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot[data-v-5dd7341e] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0.8;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot a[data-v-5dd7341e] {\n  color: #fff;\n  border-radius: 100%;\n  font-size: 35pt;\n  padding: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0px 0px 1px 2px #fff;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot a i[data-v-5dd7341e]:before {\n  display: block !important;\n  line-height: normal !important;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot a.secondary-button[data-v-5dd7341e] {\n  font-size: 15pt;\n  padding: 10px;\n}\n\n/*# sourceMappingURL=FullscreenViewCamera.vue.map */", map: {"version":3,"sources":["/Users/chenjun/easy-vue-camera/src/components/FullscreenViewCamera.vue","FullscreenViewCamera.vue"],"names":[],"mappings":"AAiMA;EACA,eAAA;EACA,OAAA;EACA,MAAA;EACA,WAAA;EACA,YAAA;AChMA;ADiMA;EACA,aAAA;EACA,sBAAA;EACA,kBAAA;EACA,YAAA;AC/LA;ADkMA;EACA,eAAA;EACA,QAAA;EACA,WAAA;EACA,WAAA;EACA,2BAAA;EACA,iBAAA;EACA,iBAAA;EACA,2BAAA;EACA,YAAA;AChMA;ADoMA;EACA,YAAA;EACA,WAAA;EACA,mBAAA;EACA,mBAAA;EACA,kBAAA;EACA,aAAA;EACA,sBAAA;AClMA;ADmMA;EACA,iBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,WAAA;ACjMA;ADmMA;EACA,eAAA;EACA,gBAAA;EACA,WAAA;EACA,YAAA;EACA,gBAAA;ACjMA;ADkMA;EACA,oDAAA;AChMA;ADkMA;EACA,WAAA;AChMA;ADoMA;EACA,4BAAA;EACA,2BAAA;EACA,sBAAA;EACA,WAAA;EACA,YAAA;AClMA;ADoMA;EACA,WAAA;EACA,aAAA;EACA,mBAAA;EACA,eAAA;EACA,SAAA;EACA,gBAAA;AClMA;ADmMA;EACA,+CAAA;ACjMA;ADmMA;EACA,gBAAA;EACA,WAAA;EACA,aAAA;EACA,mBAAA;EACA,cAAA;ACjMA;ADkMA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,YAAA;AChMA;ADiMA;EACA,WAAA;EACA,mBAAA;EACA,eAAA;EACA,YAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,gCAAA;AC/LA;ADiMA;EACA,yBAAA;EACA,8BAAA;AC/LA;ADkMA;EACA,eAAA;EACA,aAAA;AChMA;;AAEA,mDAAmD","file":"FullscreenViewCamera.vue","sourcesContent":["<template>\n    <div :style=\"{'z-index': fullscreenZIndex}\" class=\"fullscreen-camera\">\n        <div class=\"camera-stack\">\n            <div class=\"camera-stack-header\">\n                <slot name=\"header\"></slot>\n                <a  @click=\"close\"\n                    class=\"close-button\"\n                    role=\"button\"\n                    v-if=\"!hasHeader\">&times;</a>\n            </div>\n            <div class=\"video-wrapper\" v-show=\"!picture\">\n                <video :id=\"videoElementId\" autoplay playsinline></video>\n                <div :class=\"{'visible-overlay': visibleOverlay}\" class=\"overlay-mask\">\n                    <img :src=\"overlayMask\" v-if=\"visibleMask\">\n                </div>\n            </div>\n            <canvas :id=\"canvasElementId\" style=\"display: none\"></canvas>\n            <div :style=\"{'background-image' : `url(${pictureDataUrl})`}\" class=\"camera-snap\" v-show=\"picture\"></div>\n            <div :class=\"{'background': !!picture}\" class=\"camera-stack-controls\">\n                <div class=\"camera-stack-controls-wrapper\">\n                    <div class=\"control-slot\">\n                        <a @click=\"visibleMask = !visibleMask\" class=\"secondary-button\" role=\"button\" v-if=\"overlayMask && !picture\"><i class=\"mdi mdi-grid-large\"></i></a>\n                    </div>\n                    <div class=\"control-slot\">\n                        <a @click=\"$emit('snap')\" role=\"button\" v-if=\"!picture\"><i class=\"mdi mdi-circle\"></i></a>\n                        <a @click=\"approve\" role=\"button\" v-if=\"picture && mustApprove\"><i class=\"mdi mdi-check\"></i></a>\n                    </div>\n                    <div class=\"control-slot\">\n                        <a @click=\"switchCamera(false)\" \n                            :disabled=\"switching\" \n                            class=\"secondary-button\" \n                            role=\"button\" \n                            v-if=\"multiDevice && !picture\"><i class=\"mdi mdi-camera-switch\"></i></a>\n                        <a @click=\"start\"\n                            class=\"secondary-button\"\n                            role=\"button\"\n                            v-if=\"picture\"><i class=\"mdi mdi-camera-retake-outline\"></i></a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n\n<script>\nimport { v4 as uuid4 } from 'uuid';\nimport Camera from 'easy-js-camera';\n\nexport default {\n    computed: {\n        hasHeader() {\n            return typeof this.$slots.header !== 'undefined' && this.$slots.header !== null;\n        },\n        multiDevice() {\n            if(!this.camera) return false;\n            return this.camera.devices.length > 1;\n        }\n    },\n    data() {\n        return {\n            camera: null,\n            canvasElementId: `canvas-${uuid4().replace(/-/g, '')}`,\n            canvas: null,\n            picture: null,\n            pictureDataUrl: null,\n            switching: false,\n            video: null,\n            videoElementId: `video-${uuid4().replace(/-/g, '')}`,\n            visibleMask: false,\n        }\n    },\n    methods: {\n        approve() {\n            this.$emit('input', this.picture);\n            this.$emit('approve', this.picture);\n        },\n        close() {\n            this.stop();\n            this.$emit('close');\n        },\n        snapAsBlob() {\n            if(!this.camera) {\n                console.error('Camera not found to take a picture');\n                return;\n            }            \n            return new Promise(resolve => {\n                this.camera.snapAsBlob()\n                    .then(picture => {\n                        this.picture = picture;\n                        resolve(picture);\n                    });\n            });\n        }, \n        snapAsDataUrl() {\n            if(!this.camera) {\n                console.error('Camera not found to take a picture');\n                return;\n            }\n            this.picture = this.camera.snapAsDataUrl();\n            this.stop();\n            if(!this.mustApprove) {\n                this.$emit('input', this.picture);\n            }\n            return this.picture;\n        },\n        start() {\n            if(this.camera) {\n                this.picture = null;\n                this.$emit('input', null);\n                this.$emit('loading', true);\n                this.camera.start()\n                    .finally(() => this.$emit('loading', false));\n                return;\n            }\n            this.video = document.getElementById(this.videoElementId);\n            this.canvas = document.getElementById(this.canvasElementId);\n            return new Promise(resolve => {\n                Camera.tryInvokePermission(this.video, this.canvas)\n                    .then(camera => {\n                        this.camera = camera;\n                        resolve(camera);\n                    });\n            });\n        },\n        stop() {\n            if(!this.camera) {\n                return;\n            }\n            this.camera.stop();\n        },\n        switchCamera(tryAgain = false) {\n            if(this.switching && !tryAgain) return;\n            if(!this.camera) {\n                console.error('No camera found to switch...');\n                return;\n            }\n            this.switching = true;\n            return new Promise((resolve, reject) => {\n                this.camera.switch(tryAgain)\n                    .then(() => {\n                        this.switching = false;\n                        resolve();\n                    })\n                    .catch(() => {\n                        if(!tryAgain) {\n                            this.switchCamera(true);\n                        } else {\n                            this.switching = false;\n                            reject();\n                        }\n                    })\n            });\n        }\n    },\n    mounted() {\n        if(this.startOnMounted) {\n            this.$emit('loading', true);\n            this.start()\n                .then(camera => {\n                    if(camera) {\n                        camera.setVideoConstraints({facingMode:'environment'});\n                        camera.start();\n                    }\n                })\n                .finally(this.$emit('loading', false));\n        }\n    },\n    name: 'fullscreen-view-camera',\n    props: {\n        fullscreenZIndex: Number,\n        mustApprove: Boolean,\n        overlayMask: String,\n        startOnMounted: Boolean,\n        visibleOverlay: Boolean,\n    },\n    watch: {\n        picture() {\n            if(!this.picture) this.pictureDataUrl = null;\n            if(!(this.picture instanceof Blob)) {\n                this.pictureDataUrl = this.picture;\n            } else {\n                var reader = new FileReader();\n                reader.readAsDataURL(this.picture);\n                reader.onload = () => {\n                    this.pictureDataUrl = reader.result;\n                }\n            }\n        }\n    }\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.fullscreen-camera {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    .camera-stack {\n        display: flex;\n        flex-direction: column;\n        position: relative;\n        height: 100%;\n        .camera-stack-header {\n            a {\n                &.close-button {\n                    position: fixed;\n                    top: 5px;\n                    right: 15px;\n                    color: #fff;\n                    font-family: Roboto, Tahoma;\n                    font-size: 2.5rem;\n                    line-height: 40px;\n                    font-weight: 300 !important;\n                    z-index: 100;\n                }\n            }\n        }\n        .video-wrapper {\n            height: 100%;\n            width: 100%;\n            align-self: stretch;\n            align-items: center;\n            position: relative;\n            display: flex;\n            flex-direction: column;\n            video {\n                object-fit: cover;\n                position: absolute;\n                width: 100%;\n                height: 100%;\n                z-index: -1;\n            }\n            .overlay-mask {\n                max-width: 50vh;\n                max-height: 50vh;\n                width: 100%;\n                height: 100%;\n                margin-top: 10vh;\n                &.visible-overlay {\n                    box-shadow: 0px 0px 2000px 2000px rgba(0, 0, 0, .8);\n                }\n                img {\n                    width: 100%;\n                }\n            }\n        }\n        .camera-snap {\n            background-repeat: no-repeat;\n            background-position: center;\n            background-size: cover;\n            width: 100%;\n            height: 100%;\n        }\n        .camera-stack-controls {\n            width: 100%;\n            display: flex;\n            align-items: center;\n            position: fixed;\n            bottom: 0;\n            padding: 5vh 0px;\n            &.background {\n                background-color: rgba(0, 0, 0, .8) !important;\n            }\n            .camera-stack-controls-wrapper {\n                max-width: 500px;\n                width: 100%;\n                display: flex;\n                align-items: center;\n                margin: 0 auto;\n                .control-slot {\n                    width: 100%;\n                    height: 100%;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    opacity: .8;\n                    a {\n                        color: #fff;\n                        border-radius: 100%;\n                        font-size: 35pt;\n                        padding: 8px;\n                        display: flex;\n                        align-items: center;\n                        justify-content: center;\n                        box-shadow: 0px 0px 1px 2px #fff;\n                        i {\n                            &:before {\n                                display: block !important;\n                                line-height: normal !important;\n                            }\n                        }\n                        &.secondary-button {\n                            font-size: 15pt;\n                            padding: 10px;\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n</style>",".fullscreen-camera {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.fullscreen-camera .camera-stack {\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  height: 100%;\n}\n.fullscreen-camera .camera-stack .camera-stack-header a.close-button {\n  position: fixed;\n  top: 5px;\n  right: 15px;\n  color: #fff;\n  font-family: Roboto, Tahoma;\n  font-size: 2.5rem;\n  line-height: 40px;\n  font-weight: 300 !important;\n  z-index: 100;\n}\n.fullscreen-camera .camera-stack .video-wrapper {\n  height: 100%;\n  width: 100%;\n  align-self: stretch;\n  align-items: center;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.fullscreen-camera .camera-stack .video-wrapper video {\n  object-fit: cover;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n}\n.fullscreen-camera .camera-stack .video-wrapper .overlay-mask {\n  max-width: 50vh;\n  max-height: 50vh;\n  width: 100%;\n  height: 100%;\n  margin-top: 10vh;\n}\n.fullscreen-camera .camera-stack .video-wrapper .overlay-mask.visible-overlay {\n  box-shadow: 0px 0px 2000px 2000px rgba(0, 0, 0, 0.8);\n}\n.fullscreen-camera .camera-stack .video-wrapper .overlay-mask img {\n  width: 100%;\n}\n.fullscreen-camera .camera-stack .camera-snap {\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  width: 100%;\n  height: 100%;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  position: fixed;\n  bottom: 0;\n  padding: 5vh 0px;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls.background {\n  background-color: rgba(0, 0, 0, 0.8) !important;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper {\n  max-width: 500px;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  margin: 0 auto;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0.8;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot a {\n  color: #fff;\n  border-radius: 100%;\n  font-size: 35pt;\n  padding: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0px 0px 1px 2px #fff;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot a i:before {\n  display: block !important;\n  line-height: normal !important;\n}\n.fullscreen-camera .camera-stack .camera-stack-controls .camera-stack-controls-wrapper .control-slot a.secondary-button {\n  font-size: 15pt;\n  padding: 10px;\n}\n\n/*# sourceMappingURL=FullscreenViewCamera.vue.map */"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__ = "data-v-5dd7341e";
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      var __vue_component__ = /*#__PURE__*/normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        createInjector,
        undefined,
        undefined
      );

    //

    var script$1 = {
        data: function data() {
            return {
                camera: null,
                canvasElementId: ("canvas-" + (uuid.v4().replace(/-/g, ''))),
                canvas: null,
                picture: null,
                switching: false,
                video: null,
                videoElementId: ("video-" + (uuid.v4().replace(/-/g, ''))),
                visibleMask: false,
            }
        },
        methods: {
            snapAsBlob: function snapAsBlob() {
                var this$1 = this;

                if(!this.camera) {
                    console.error('Camera not found to take a picture');
                    return;
                }            
                return new Promise(function (resolve) {
                    this$1.camera.snapAsBlob()
                        .then(function (picture) {
                            this$1.picture = picture;
                            resolve(picture);
                        });
                });
            }, 
            snapAsDataUrl: function snapAsDataUrl() {
                if(!this.camera) {
                    console.error('Camera not found to take a picture');
                    return;
                }
                this.picture = this.camera.snapAsDataUrl();
                this.stop();
                return this.picture;
            },
            start: function start() {
                var this$1 = this;

                if(this.camera) {
                    this.picture = null;
                    this.$emit('loading', true);
                    this.camera.start()
                        .finally(function () { return this$1.$emit('loading', false); });
                    return;
                }
                this.video = document.getElementById(this.videoElementId);
                this.canvas = document.getElementById(this.canvasElementId);
                return new Promise(function (resolve) {
                    Camera__default['default'].tryInvokePermission(this$1.video, this$1.canvas)
                        .then(function (camera) {
                            this$1.camera = camera;
                            resolve(camera);
                        });
                });
            },
            stop: function stop() {
                if(!this.camera) {
                    return;
                }
                this.camera.stop();
            },
            switchCamera: function switchCamera(tryAgain) {
                var this$1 = this;
                if ( tryAgain === void 0 ) tryAgain = false;

                if(this.switching && !tryAgain) { return; }
                if(!this.camera) {
                    console.error('No camera found to switch...');
                    return;
                }
                this.switching = true;
                return new Promise(function (resolve, reject) {
                    this$1.camera.switch(tryAgain)
                        .then(function () {
                            this$1.switching = false;
                            resolve();
                        })
                        .catch(function () {
                            if(!tryAgain) {
                                this$1.switchCamera(true);
                            } else {
                                this$1.switching = false;
                                reject();
                            }
                        });
                });
            },
            toggleMask: function toggleMask() {
                this.visibleMask = !this.visibleMask;
            }
        },
        mounted: function mounted() {
            if(this.startOnMounted) {
                this.$emit('loading', true);
                this.start()
                    .then(function (camera) {
                        if(camera) {
                            camera.start();
                        }
                    })
                    .finally(this.$emit('loading', false));
            }
        },
        name: 'standard-view-camera',
        props: {
            overlayMask: String,
            startOnMounted: Boolean,
            visibleOverlay: Boolean
        }
    };

    /* script */
    var __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "video-wrapper" }, [
        _c("video", {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.picture,
              expression: "!picture"
            }
          ],
          attrs: { id: _vm.videoElementId, autoplay: "", playsinline: "" }
        }),
        _vm._v(" "),
        _c("canvas", {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.picture,
              expression: "picture"
            }
          ],
          attrs: { id: _vm.canvasElementId }
        }),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "overlay",
            class: { "visible-overlay": _vm.visibleOverlay }
          },
          [
            _vm.visibleMask
              ? _c("img", { attrs: { src: _vm.overlayMask } })
              : _vm._e()
          ]
        )
      ])
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      var __vue_inject_styles__$1 = function (inject) {
        if (!inject) { return }
        inject("data-v-41cdda24_0", { source: ".video-wrapper[data-v-41cdda24] {\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  position: relative;\n}\n.video-wrapper video[data-v-41cdda24] {\n  width: 100%;\n  height: auto;\n}\n.video-wrapper canvas[data-v-41cdda24] {\n  width: 100%;\n  height: auto;\n}\n.video-wrapper .overlay[data-v-41cdda24] {\n  position: absolute;\n  left: 100%;\n  transform: translateX(-50%);\n  height: 100%;\n  width: auto;\n  display: flex;\n}\n.video-wrapper .overlay.visible-overlay[data-v-41cdda24] {\n  box-shadow: 0px 0px 2000px 2000px rgba(0, 0, 0, 0.8);\n}\n.video-wrapper .overlay img[data-v-41cdda24] {\n  height: auto;\n}\n\n/*# sourceMappingURL=StandardViewCamera.vue.map */", map: {"version":3,"sources":["/Users/chenjun/easy-vue-camera/src/components/StandardViewCamera.vue","StandardViewCamera.vue"],"names":[],"mappings":"AA0HA;EACA,gBAAA;EACA,aAAA;EACA,mBAAA;EACA,kBAAA;ACzHA;AD0HA;EACA,WAAA;EACA,YAAA;ACxHA;AD0HA;EACA,WAAA;EACA,YAAA;ACxHA;AD0HA;EACA,kBAAA;EACA,UAAA;EACA,2BAAA;EACA,YAAA;EACA,WAAA;EACA,aAAA;ACxHA;ADyHA;EACA,oDAAA;ACvHA;ADyHA;EACA,YAAA;ACvHA;;AAEA,iDAAiD","file":"StandardViewCamera.vue","sourcesContent":["<template>\n    <div class=\"video-wrapper\">\n        <video :id=\"videoElementId\" autoplay playsinline v-show=\"!picture\"></video>\n        <canvas :id=\"canvasElementId\" v-show=\"picture\"></canvas>\n        <div :class=\"{'visible-overlay': visibleOverlay}\" class=\"overlay\">\n            <img :src=\"overlayMask\" v-if=\"visibleMask\">\n        </div>\n    </div>\n</template>\n\n<script>\nimport { v4 as uuid4 } from 'uuid';\nimport Camera from 'easy-js-camera';\n\nexport default {\n    data() {\n        return {\n            camera: null,\n            canvasElementId: `canvas-${uuid4().replace(/-/g, '')}`,\n            canvas: null,\n            picture: null,\n            switching: false,\n            video: null,\n            videoElementId: `video-${uuid4().replace(/-/g, '')}`,\n            visibleMask: false,\n        }\n    },\n    methods: {\n        snapAsBlob() {\n            if(!this.camera) {\n                console.error('Camera not found to take a picture');\n                return;\n            }            \n            return new Promise(resolve => {\n                this.camera.snapAsBlob()\n                    .then(picture => {\n                        this.picture = picture;\n                        resolve(picture);\n                    });\n            });\n        }, \n        snapAsDataUrl() {\n            if(!this.camera) {\n                console.error('Camera not found to take a picture');\n                return;\n            }\n            this.picture = this.camera.snapAsDataUrl();\n            this.stop();\n            return this.picture;\n        },\n        start() {\n            if(this.camera) {\n                this.picture = null;\n                this.$emit('loading', true);\n                this.camera.start()\n                    .finally(() => this.$emit('loading', false));\n                return;\n            }\n            this.video = document.getElementById(this.videoElementId);\n            this.canvas = document.getElementById(this.canvasElementId);\n            return new Promise(resolve => {\n                Camera.tryInvokePermission(this.video, this.canvas)\n                    .then(camera => {\n                        this.camera = camera;\n                        resolve(camera);\n                    });\n            });\n        },\n        stop() {\n            if(!this.camera) {\n                return;\n            }\n            this.camera.stop();\n        },\n        switchCamera(tryAgain = false) {\n            if(this.switching && !tryAgain) return;\n            if(!this.camera) {\n                console.error('No camera found to switch...');\n                return;\n            }\n            this.switching = true;\n            return new Promise((resolve, reject) => {\n                this.camera.switch(tryAgain)\n                    .then(() => {\n                        this.switching = false;\n                        resolve();\n                    })\n                    .catch(() => {\n                        if(!tryAgain) {\n                            this.switchCamera(true);\n                        } else {\n                            this.switching = false;\n                            reject();\n                        }\n                    })\n            });\n        },\n        toggleMask() {\n            this.visibleMask = !this.visibleMask;\n        }\n    },\n    mounted() {\n        if(this.startOnMounted) {\n            this.$emit('loading', true);\n            this.start()\n                .then(camera => {\n                    if(camera) {\n                        camera.start();\n                    }\n                })\n                .finally(this.$emit('loading', false));\n        }\n    },\n    name: 'standard-view-camera',\n    props: {\n        overlayMask: String,\n        startOnMounted: Boolean,\n        visibleOverlay: Boolean\n    }\n}\n</script>\n<style lang=\"scss\" scoped>\n.video-wrapper {\n    overflow: hidden;\n    display: flex;\n    align-items: center;\n    position: relative;\n    video {\n        width: 100%;\n        height: auto;\n    }\n    canvas {\n        width: 100%;\n        height: auto;\n    }\n    .overlay {\n        position: absolute;\n        left: 100%;\n        transform: translateX(-50%);\n        height: 100%;\n        width: auto;\n        display: flex;\n        &.visible-overlay {\n            box-shadow: 0px 0px 2000px 2000px rgba(0, 0, 0, .8);\n        }\n        img {\n            height: auto;\n        }\n    }\n}\n</style>",".video-wrapper {\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  position: relative;\n}\n.video-wrapper video {\n  width: 100%;\n  height: auto;\n}\n.video-wrapper canvas {\n  width: 100%;\n  height: auto;\n}\n.video-wrapper .overlay {\n  position: absolute;\n  left: 100%;\n  transform: translateX(-50%);\n  height: 100%;\n  width: auto;\n  display: flex;\n}\n.video-wrapper .overlay.visible-overlay {\n  box-shadow: 0px 0px 2000px 2000px rgba(0, 0, 0, 0.8);\n}\n.video-wrapper .overlay img {\n  height: auto;\n}\n\n/*# sourceMappingURL=StandardViewCamera.vue.map */"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$1 = "data-v-41cdda24";
      /* module identifier */
      var __vue_module_identifier__$1 = undefined;
      /* functional template */
      var __vue_is_functional_template__$1 = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        false,
        createInjector,
        undefined,
        undefined
      );

    var OutputType = {
        dataUrl: 'dataUrl',
        blob: 'blob'
    };

    var DeviceUtils = function DeviceUtils () {};

    DeviceUtils.isTouchScreen = function isTouchScreen () {
        var touchDevice = (navigator.maxTouchPoints > 0 || 'ontouchstart' in document.documentElement);
        return touchDevice;
    };

    //

    var script$2 = {
        components: {
            FullscreenViewCamera: __vue_component__,
            StandardViewCamera: __vue_component__$1
        },
        computed: {
            isTouchScreen: function isTouchScreen() {
                return DeviceUtils.isTouchScreen();
            },
            multiDevice: function multiDevice() {
                if(!this.refCameraComponent) { return false; }
                return this.refCameraComponent.camera.devices.length > 1;
            },
            refCameraComponent: function refCameraComponent() {
                return this.refFullscreenCamera ? this.refFullscreenCamera : this.refStandardCamera;
            },
            refFullscreenCamera: function refFullscreenCamera() {
                return this.$refs.fullscreenCameraRef;
            },
            refStandardCamera: function refStandardCamera() {
                return this.$refs.standardCameraRef;
            },
            viewFullscreen: function viewFullscreen() {
                return this.fullscreen || (this.isTouchScreen && this.autoDetectMobile);
            },
            viewStandard: function viewStandard() {
                return !this.viewFullscreen;
            },
        },
        data: function data() {
            return {
                camera: null,
            }
        }, 
        methods: {
            close: function close() {
                if(this.refFullscreenCamera) {
                    this.refFullscreenCamera.close();
                } else {
                    this.stop();
                    this.$emit('close');
                }
            },
            snap: function snap() {
                var this$1 = this;

                if(this.output === OutputType.dataUrl) {
                    var picture = this.refCameraComponent.snapAsDataUrl();
                    this.stop();
                    if(!this.mustApprove || !this.fullscreen) {
                        this.$emit('input', picture);
                    }
                } else {
                    this.$emit('loading', true);
                    this.refCameraComponent.snapAsBlob()
                        .then(function (picture) {
                            this$1.stop();
                            if(!this$1.mustApprove || !this$1.fullscreen) {
                                this$1.$emit('input', picture);
                            }
                        }).finally(function () { return this$1.$emit('loading', false); });
                }
            },
            start: function start() {
                var this$1 = this;

                this.$emit('loading', true);
                this.refCameraComponent
                    .start(function (camera) {
                        if(camera) {
                            this$1.$emit('loading', true);
                            camera.start()
                                .finally(function () { return this$1.$emit('loading', false); });
                        }
                    });
            },
            stop: function stop() {
                if(this.refCameraComponent === null) { return; }
                this.refCameraComponent.stop();
            },
            switchCamera: function switchCamera() {
                var this$1 = this;

                if(!this.refCameraComponent) { return; }
                this.$emit('loading', true);
                this.refCameraComponent.switchCamera(false)
                    .finally(function () { return this$1.$emit('loading', false); });
            },
            toggleMask: function toggleMask() {
                if(!this.refStandardCamera) { return; }
                this.refStandardCamera.toggleMask();
            }
        },
        name: 'easy-camera',
        props: {
            autoDetectMobile: {
                type: Boolean,
                default: true  
            },
            fullscreen: Boolean,
            fullscreenZIndex: {
                type: Number,
                default: 17
            },
            mustApprove: {
                type: Boolean,
                default: false
            },
            output: {
                type: String,
                default: OutputType.dataUrl
            },
            overlayMask: {
                type: String,
                default: null
            },
            startOnMounted: {
                type: Boolean,
                default: true
            },
            value: {},
            visibleOverlay: Boolean
        },
    };

    /* script */
    var __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
      var this$1 = this;
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.viewFullscreen
        ? _c("fullscreen-view-camera", {
            ref: "fullscreenCameraRef",
            attrs: {
              "fullscreen-z-index": _vm.fullscreenZIndex,
              "must-approve": _vm.mustApprove,
              "overlay-mask": _vm.overlayMask,
              "start-on-mounted": _vm.startOnMounted,
              "visible-overlay": _vm.visibleOverlay
            },
            on: {
              approve: function(picture) {
                this$1.$emit("approve", picture);
                this$1.$emit("input", picture);
              },
              loading: function(loading) {
                this$1.$emit("loading", loading);
              },
              snap: _vm.snap,
              close: function($event) {
                return _vm.$emit("close")
              }
            },
            scopedSlots: _vm._u(
              [
                {
                  key: "header",
                  fn: function() {
                    return [_vm._t("header")]
                  },
                  proxy: true
                }
              ],
              null,
              true
            )
          })
        : _c("standard-view-camera", {
            ref: "standardCameraRef",
            attrs: {
              "overlay-mask": _vm.overlayMask,
              "start-on-mounted": _vm.startOnMounted,
              "visible-overlay": _vm.visibleOverlay
            },
            on: {
              loading: function(loading) {
                this$1.$emit("loading", true);
              }
            }
          })
    };
    var __vue_staticRenderFns__$2 = [];
    __vue_render__$2._withStripped = true;

      /* style */
      var __vue_inject_styles__$2 = undefined;
      /* scoped */
      var __vue_scope_id__$2 = undefined;
      /* module identifier */
      var __vue_module_identifier__$2 = undefined;
      /* functional template */
      var __vue_is_functional_template__$2 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      var __vue_component__$2 = /*#__PURE__*/normalizeComponent(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        false,
        undefined,
        undefined,
        undefined
      );

    function install(Vue) {
      if(install.installed) { return; }
      install.installed = true;
      Vue.component('v-easy-camera', __vue_component__$2);
    }
    var plugin = {
      install: install
    };


    // Auto-install when vue is found (eg. in browser via <script> tag)
    var GlobalVue = null;
    if (typeof window !== 'undefined') {
    	GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
    	GlobalVue = global.Vue;
    }
    if (GlobalVue) {
    	GlobalVue.use(plugin);
    }

    exports.DeviceUtils = DeviceUtils;
    exports.OutputType = OutputType;
    exports.default = __vue_component__$2;
    exports.install = install;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

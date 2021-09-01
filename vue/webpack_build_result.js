(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-01b68e5c"],
  {
    /***/ "6114": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      // ESM COMPAT FLAG
      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"7e206c3e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/creator/views/income/index.vue?vue&type=template&id=64bf90dd&scoped=true&
      var render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "pageincome" }, [
          _c("div", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.isapp && _vm.ischeckLver,
                expression: "isapp && ischeckLver",
              },
            ],
            staticClass: "apptop",
          }),
          _c("img", {
            attrs: {
              src:
                "https://static.soyoung.com/sy-pre/20220611-1591852200702.png",
              width: "100%",
            },
          }),
          _c("div", { staticClass: "main" }, [
            _c("div", { staticClass: "title" }, [_vm._v("你将收获什么？")]),
            _vm._m(0),
            _vm._m(1),
            _vm.issure
              ? _c(
                  "div",
                  { staticClass: "botton ccc", on: { click: _vm.totoast } },
                  [_vm._v("申请加入")]
                )
              : _c("div", { staticClass: "botton", on: { click: _vm.ask } }, [
                  _vm._v("申请加入"),
                ]),
          ]),
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isShow,
                  expression: "isShow",
                },
              ],
              staticClass: "layer",
            },
            [
              _c(
                "div",
                { staticClass: "foot", class: _vm.isShowanmiate ? "show" : "" },
                [
                  _c("img", {
                    attrs: {
                      src:
                        "https://static.soyoung.com/sy-pre/2020061104-1591855800720.png",
                    },
                  }),
                  _c("div", { staticClass: "title" }, [_vm._v("已成功加入")]),
                  _c("p", [_vm._v("创作激励收益从加入后发布内容开始计算")]),
                  _c(
                    "div",
                    {
                      staticClass: "botton",
                      class: _vm.isIphoneX ? "marginBottom" : "",
                      on: { click: _vm.go },
                    },
                    [_vm._v("知道啦")]
                  ),
                ]
              ),
            ]
          ),
        ]);
      };
      var staticRenderFns = [
        function() {
          var _vm = this;
          var _h = _vm.$createElement;
          var _c = _vm._self._c || _h;
          return _c("ul", [
            _c("li", [
              _c("img", {
                attrs: {
                  src:
                    "https://static.soyoung.com/sy-pre/2020061101-1591855800720.png",
                },
              }),
              _c("p", [_vm._v("内容浏览量收益")]),
              _c("span", [_vm._v("高浏览带来高收入！")]),
            ]),
            _c("li", [
              _c("img", {
                attrs: {
                  src:
                    "https://static.soyoung.com/sy-pre/2020061102-1591855800720.png",
                },
              }),
              _c("p", [_vm._v("更多流量奖励")]),
              _c("span", [_vm._v("内容互动赢取更多流量")]),
            ]),
            _c("li", [
              _c("img", {
                attrs: {
                  src:
                    "https://static.soyoung.com/sy-pre/2020061103-1591855800720.png",
                },
              }),
              _c("p", [_vm._v("新氧新星指日可待")]),
              _c("span", [_vm._v("创作指引，榜单活动")]),
            ]),
          ]);
        },
        function() {
          var _vm = this;
          var _h = _vm.$createElement;
          var _c = _vm._self._c || _h;
          return _c("div", { staticClass: "foot" }, [
            _c("p", [
              _vm._v("\n        加入条件\n        "),
              _c("span", [_vm._v("以下条件满足其中一项即可申请加入")]),
            ]),
            _c("p", [_vm._v("1、新氧达人：90天通过首页审核内容数>=5")]),
            _c("p", [
              _vm._v("2、普通用户：粉丝数>=50，90天内通过首页审核内容数>=3"),
            ]),
          ]);
        },
      ];

      // CONCATENATED MODULE: ./src/pages/creator/views/income/index.vue?vue&type=template&id=64bf90dd&scoped=true&

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
      var es6_regexp_split = __webpack_require__("28a5");

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
      var es6_regexp_replace = __webpack_require__("a481");

      // EXTERNAL MODULE: ./src/utils/send-msg-to-app.js
      var send_msg_to_app = __webpack_require__("52a0");

      // EXTERNAL MODULE: ./src/api/creator.js
      var creator = __webpack_require__("db64");

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/creator/views/income/index.vue?vue&type=script&lang=js&

      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      /* harmony default export */

      var incomevue_type_script_lang_js_ = {
        data: function data() {
          return {
            isIphoneX: this.$utils.isIphoneX(),
            isapp: this.$utils.isApp(),
            ischeckLver: false,
            isShow: false,
            isShowanmiate: false,
            issure: true,
            ismcn_sub: false,
          };
        },
        methods: {
          ask: function ask() {
            var _this = this;

            this.$report("event", {
              event_name: "sy_app_post_creator_center:allowance_apply_click",
            });
            Object(creator["b" /* applyfor */])({
              sm_device_id: this.$route.query.sm_device_id,
            }).then(function(data) {
              if (data.errorCode == 0) {
                _this.isShow = true;
                _this.ismcn_sub =
                  data.responseData.ismcn_sub == 1 ? true : false;
                setTimeout(function() {
                  _this.isShowanmiate = true;
                }, 100);

                if (_this.isapp) {
                  send_msg_to_app["a" /* default */].toApp(
                    "refreshNativePage",
                    {}
                  );
                }
              } else {
                _this.$toast(data.errorMsg);
              }
            });
          },
          go: function go() {
            if (this.ismcn_sub) {
              this.$router.replace({
                path: "/income/subAccount",
              });
            } else {
              this.$router.replace({
                path: "/income/main",
              });
            }
          },
          checkLver: function checkLver() {
            var level = window.globalInfo.lver.split(".");
            var flag = false;

            if (level[0] > 8) {
              flag = true;
            } else if (level[0] == 8) {
              if (level[1] >= 3) {
                flag = true;
              } else {
                flag = false;
              }
            } else {
              flag = false;
            }

            return flag;
          },
          totoast: function totoast() {
            //Bridge.toApp("refreshNativePage", {});
            this.$toast("暂不满足加入条件，完成后再来试试~");
          },
        },
        created: function created() {
          this.$report("page", {
            page_name: "sy_app_post_creator_center:allowance_apply_page",
          });
        },
        mounted: function mounted() {
          var _this2 = this;

          this.isapp = this.$utils.isApp();
          this.ischeckLver = this.checkLver();
          Object(creator["e" /* checkrule */])().then(function(data) {
            if (data.errorCode == 0) {
              _this2.issure = false;
            } else if (data.errorCode == -1) {
              var url = window.location.href;

              if (_this2.$utils.isApp()) {
                window.location.href = "app.soyoung://login?callback=".concat(
                  url
                );
              } else {
                _this2.$router.push({
                  path: "/login?back=" + encodeURIComponent("/income/index"),
                });
              }
            } else {
              if (data.errorMsg) {
                _this2.$toast(data.errorMsg);
              }
            }
          });

          if (this.ischeckLver && this.isapp) {
            // Bridge.toApp("setNavigationBar", {
            //   transition: true, //滚动是否透明
            //   type: "2", // 2
            //   fontColor: "0xffffff",
            //   bgColor: "0xffffff",
            //   fontColorUpGlide: "0x000000"
            // });
            send_msg_to_app["a" /* default */].toApp("configNavigationBar", {
              transform_type: 1,
              // 0 默认无沉浸式 1 沉浸式
              transform_offset: 88,
              // 过渡偏移量 100
              background_view: {
                background_color: "1fdcc6",
              },
              left_view: {
                transparency_color: "ffffff",
                un_transparency_color: "ffffff",
              },
              title_view: {
                type: 0,
                // 0 显示标题 1search
                transparency_color: "ffffff",
                un_transparency_color: "ffffff",
                title: "创作激励",
              },
            });
          }
        },
      };
      // CONCATENATED MODULE: ./src/pages/creator/views/income/index.vue?vue&type=script&lang=js&
      /* harmony default export */ var views_incomevue_type_script_lang_js_ = incomevue_type_script_lang_js_;
      // EXTERNAL MODULE: ./src/pages/creator/views/income/index.vue?vue&type=style&index=0&id=64bf90dd&lang=less&scoped=true&
      var incomevue_type_style_index_0_id_64bf90dd_lang_less_scoped_true_ = __webpack_require__(
        "f1aa"
      );

      // EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
      var componentNormalizer = __webpack_require__("2877");

      // CONCATENATED MODULE: ./src/pages/creator/views/income/index.vue

      /* normalize component */

      var component = Object(componentNormalizer["a" /* default */])(
        views_incomevue_type_script_lang_js_,
        render,
        staticRenderFns,
        false,
        null,
        "64bf90dd",
        null
      );

      /* harmony default export */ var income = (__webpack_exports__[
        "default"
      ] = component.exports);

      /***/
    },

    /***/ "7914": /***/ function(module, exports, __webpack_require__) {
      // extracted by mini-css-extract-plugin
      /***/
    },

    /***/ db64: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "c",
        function() {
          return cancelGetContentListByParams;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "d",
        function() {
          return checkPhoneNumber;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "h",
        function() {
          return getAuthConfirmInfo;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "f",
        function() {
          return confirmApply;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "i",
        function() {
          return getCollegeIndex;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "j",
        function() {
          return getCollegeList;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "k",
        function() {
          return getContentListByParams;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "g",
        function() {
          return deletePostByPostId;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "r",
        function() {
          return getSummary;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "q",
        function() {
          return getPostlist;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "p",
        function() {
          return getPostdetail;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "l",
        function() {
          return getMotivateSummary;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "n",
        function() {
          return getMotivateUserPostSummary;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "m",
        function() {
          return getMotivateUserPostDailyAmount;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "o",
        function() {
          return getMotivatepostlistAmount;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "a",
        function() {
          return GetMcnInfo;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "b",
        function() {
          return applyfor;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "e",
        function() {
          return checkrule;
        }
      );
      /* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "c1fb"
      );
      /* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        "bc3a"
      );
      /* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
        axios__WEBPACK_IMPORTED_MODULE_1__
      );
      // /super/getUserCondition?authentication_type=1

      var URL_AUTH_CHECK = "/mcnManage/applyAuth";
      var URL_AUTH_INFO = "/mcnManage/getAuthInfo";
      var URL_AUTH_CONFIRM = "/mcnManage/acceptAuth";
      var URL_MANAGEMENT = "/diary/contentlist";
      var URL_DELETE_POST = "/diary/handlePost";
      var URL_DATACENTER_SUMMARY = "/datacenter/summary";
      var URL_DATACENTER_POSTLIST = "/datacenter/postlist";
      var URL_DATACENTER_POSTDETAIL = "/datacenter/postdetail";
      var URL_MOTIVATE_SUMMARY = "/motivate/summary";
      var URL_MOTIVATE_USERPOSTSUMMARY = "/motivate/userPostSummary";
      var URL_MOTIVATE_USERPOSTDAILYAMOUNT = "/motivate/userPostDailyAmount";
      var URL_MOTIVATE_POSTLISTAMOUNT = "/motivate/postlistAmount";
      var URL_MOTIVATE_GETMCNINFO = "/motivate/GetMcnInfo";
      var CancelToken =
        axios__WEBPACK_IMPORTED_MODULE_1___default.a.CancelToken;
      var cancelGetContentListByParams; // 添加你想认证的手机号码

      var checkPhoneNumber = function checkPhoneNumber(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_AUTH_CHECK,
          method: "post",
        });
      }; // 获取认证页面的基本信息

      var getAuthConfirmInfo = function getAuthConfirmInfo(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_AUTH_INFO,
          method: "post",
        });
      }; // 被邀请者的确认接口

      var confirmApply = function confirmApply(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_AUTH_CONFIRM,
          method: "post",
        });
      }; // 创作者学院 index

      var getCollegeIndex = function getCollegeIndex(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/creatorsCollege/getCollegeIndex",
          method: "post",
        });
      }; // 创作者学院 list

      var getCollegeList = function getCollegeList(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/creatorsCollege/getCollegeList",
          method: "post",
        });
      }; // 获取内容列表数据

      var getContentListByParams = function getContentListByParams(params) {
        // 频繁点击switch类按钮的时候，如果再网速不好的情况下，会阻塞很多次请求，堆积的结果返回会造成不符合的预期；
        // 所以所有的switch操作，都会取消当前的请求，并准备进入下次请求；如果是下拉加载更多的操作，我们期望的是等待，而不是取消请求
        cancelGetContentListByParams && cancelGetContentListByParams();
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          method: "post",
          url: URL_MANAGEMENT,
          cancelToken: new CancelToken(function executor(c) {
            cancelGetContentListByParams = c;
          }),
        });
      }; // 获取内容列表数据

      var deletePostByPostId = function deletePostByPostId(post_id) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: {
            post_id: post_id,
          },
          method: "post",
          url: URL_DELETE_POST,
        });
      }; // 数据中心 概览

      var getSummary = function getSummary(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_DATACENTER_SUMMARY,
          method: "post",
        });
      }; // 数据中心 帖子列表 1:图文 2:视频

      var getPostlist = function getPostlist(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_DATACENTER_POSTLIST,
          method: "post",
        });
      }; // 帖子数据详情

      var getPostdetail = function getPostdetail(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_DATACENTER_POSTDETAIL,
          method: "post",
        });
      };
      var getMotivateSummary = function getMotivateSummary(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_MOTIVATE_SUMMARY,
          method: "post",
        });
      };
      var getMotivateUserPostSummary = function getMotivateUserPostSummary(
        params
      ) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_MOTIVATE_USERPOSTSUMMARY,
          method: "post",
        });
      };
      var getMotivateUserPostDailyAmount = function getMotivateUserPostDailyAmount(
        params
      ) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: URL_MOTIVATE_USERPOSTDAILYAMOUNT,
          method: "post",
        });
      };
      var getMotivatepostlistAmount = function getMotivatepostlistAmount(
        params
      ) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          method: "post",
          url: URL_MOTIVATE_POSTLISTAMOUNT,
        });
      };
      var GetMcnInfo = function GetMcnInfo(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          method: "post",
          url: URL_MOTIVATE_GETMCNINFO,
        });
      };
      var applyfor = function applyfor(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          // method: 'post',
          url: "/motivate/applyfor",
        });
      };
      var checkrule = function checkrule(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          // method: 'post',
          url: "/motivate/checkrule",
        });
      };

      /***/
    },

    /***/ f1aa: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_64bf90dd_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "7914"
      );
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_64bf90dd_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_64bf90dd_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__
      );
      /* unused harmony reexport * */
      /* unused harmony default export */ var _unused_webpack_default_export =
        _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_64bf90dd_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a;

      /***/
    },
  },
]);

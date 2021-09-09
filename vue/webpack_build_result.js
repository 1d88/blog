(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-3a65021e"],
  {
    /***/ "07e8": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"3a672da0-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/filter-group/index.vue?vue&type=template&id=1befa301&scoped=true&
      var render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "div",
          {
            staticClass: "filter",
            on: {
              click: function($event) {
                if ($event.target !== $event.currentTarget) {
                  return null;
                }
                return _vm.$emit("close");
              },
            },
          },
          [
            _c("div", { staticClass: "filter__nav" }, [
              _c(
                "div",
                {
                  staticClass: "filter__nav--item",
                  class: { "is-active": _vm.selectedSort === "city" },
                  on: {
                    click: function($event) {
                      return _vm.$emit("select-city");
                    },
                  },
                },
                [
                  _c(
                    "span",
                    {
                      staticClass: "filter__item--text",
                      on: {
                        click: function($event) {
                          if ($event.target !== $event.currentTarget) {
                            return null;
                          }
                          return _vm.$emit("close");
                        },
                      },
                    },
                    [_vm._v(_vm._s(_vm.cityInfo.name))]
                  ),
                ]
              ),
              _c(
                "div",
                {
                  staticClass: "filter__nav--item",
                  class: { "is-active": _vm.selectedSort === "sort" },
                  on: {
                    click: function($event) {
                      return _vm.$emit("select-sort");
                    },
                  },
                },
                [
                  _c(
                    "span",
                    {
                      staticClass: "filter__item--text",
                      on: {
                        click: function($event) {
                          if ($event.target !== $event.currentTarget) {
                            return null;
                          }
                          return _vm.$emit("close");
                        },
                      },
                    },
                    [_vm._v(_vm._s(_vm.sortInfo.name))]
                  ),
                ]
              ),
            ]),
            _c(
              "div",
              { staticClass: "filter__main" },
              [
                _vm.selectedSort === "city"
                  ? _c("city", {
                      attrs: { list: _vm.list.city, cityInfo: _vm.cityInfo },
                      on: { getSelected: _vm.getSelected },
                    })
                  : _vm._e(),
                _vm.selectedSort === "sort"
                  ? _c(
                      "ul",
                      { staticClass: "filter__smart" },
                      [
                        _vm._l(_vm.list.sortNew, function(item) {
                          return [
                            item.name !== "离我最近"
                              ? _c(
                                  "li",
                                  {
                                    key: item.name,
                                    staticClass: "filter__smart--item",
                                    class: {
                                      "is-active":
                                        +_vm.sortInfo.sort === +item.sort,
                                    },
                                    on: {
                                      click: function($event) {
                                        return _vm.getSort(item);
                                      },
                                    },
                                  },
                                  [
                                    _vm._v(
                                      "\n          " +
                                        _vm._s(item.name) +
                                        "\n        "
                                    ),
                                  ]
                                )
                              : _vm._e(),
                          ];
                        }),
                      ],
                      2
                    )
                  : _vm._e(),
              ],
              1
            ),
          ]
        );
      };
      var staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/filter-group/index.vue?vue&type=template&id=1befa301&scoped=true&

      // EXTERNAL MODULE: ./src/components/filter-group/city.vue + 4 modules
      var city = __webpack_require__("d12a");

      /* harmony default export */ var filter_groupvue_type_script_lang_js_ = {
        name: "filter-group",
        props: ["selectionSource", "selectedSort", "cityInfo", "sortInfo"],
        data: function data() {
          return {
            list: {}, //所有筛选项数据
          };
        },
        created: function created() {
          this.list = this.selectionSource;
        },
        methods: {
          // 获取已选城市
          getSelected: function getSelected(params) {
            this.$emit("renderNewChange", "city", params);
          },
          // 获取智能筛选
          getSort: function getSort(params) {
            this.$emit("renderNewChange", "sort", params); // this.smartSort = params.sort || 0;
          },
        },
        components: {
          city: city["a" /* default */],
        },
      };
      // CONCATENATED MODULE: ./src/components/filter-group/index.vue?vue&type=script&lang=js&
      /* harmony default export */ var components_filter_groupvue_type_script_lang_js_ = filter_groupvue_type_script_lang_js_;
      // EXTERNAL MODULE: ./src/components/filter-group/index.vue?vue&type=style&index=0&id=1befa301&lang=less&scoped=true&
      var filter_groupvue_type_style_index_0_id_1befa301_lang_less_scoped_true_ = __webpack_require__(
        "d4ab"
      );

      // EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
      var componentNormalizer = __webpack_require__("2877");

      // CONCATENATED MODULE: ./src/components/filter-group/index.vue

      /* normalize component */

      var component = Object(componentNormalizer["a" /* default */])(
        components_filter_groupvue_type_script_lang_js_,
        render,
        staticRenderFns,
        false,
        null,
        "1befa301",
        null
      );

      /* harmony default export */ var filter_group = (__webpack_exports__[
        "a"
      ] = component.exports);

      /***/
    },

    /***/ "0843": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_01_vue_vue_type_style_index_1_id_27f76de3_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "4e34"
      );
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_01_vue_vue_type_style_index_1_id_27f76de3_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_01_vue_vue_type_style_index_1_id_27f76de3_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__
      );
      /* unused harmony reexport * */

      /***/
    },

    /***/ "0b92": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "c",
        function() {
          return getFilterData;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "a",
        function() {
          return RepeatPurchaseInit;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "b",
        function() {
          return RepeatPurchaseList;
        }
      );
      /* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "c1fb"
      );
      // http://syapi.sy.soyoung.com/project/424/interface/api/cat_5141
      // 获取筛选项数据 如： 城市、智能排序

      var getFilterData = function getFilterData(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/itemcity/product",
          baseURL: "/",
          method: "post",
        });
      };
      var RepeatPurchaseInit = function RepeatPurchaseInit(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/RepeatPurchase/Index",
          baseURL: "/",
          method: "post",
        });
      };
      var RepeatPurchaseList = function RepeatPurchaseList(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/RepeatPurchase/ProductList",
          baseURL: "/",
          method: "post",
        });
      };

      /***/
    },

    /***/ "3ddb": /***/ function(module, exports, __webpack_require__) {
      // extracted by mini-css-extract-plugin
      /***/
    },

    /***/ "4e34": /***/ function(module, exports, __webpack_require__) {
      // extracted by mini-css-extract-plugin
      /***/
    },

    /***/ "5a61": /***/ function(module) {
      module.exports = JSON.parse(
        '{"newuserProduct":[{"city_name":"重庆市","ext":[],"hospital_name":"重庆五洲整形美容","img_cover":"","order_cnt":"0","pid":"1189","price_online":"11","price_origin":"200","title":"【玻尿酸导入】五洲整形<手术预约订金>专用项目"},{"city_name":"重庆市","ext":[],"hospital_name":"重庆五洲整形美容","img_cover":"","order_cnt":"0","pid":"1189","price_online":"11","price_origin":"200","title":"【玻尿酸导入】五洲整形<手术预约订金>专用项目"},{"city_name":"重庆市","ext":[],"hospital_name":"重庆五洲整形美容","img_cover":"","order_cnt":"0","pid":"1189","price_online":"11","price_origin":"200","title":"【玻尿酸导入】五洲整形<手术预约订金>专用项目"},{"city_name":"重庆市","ext":[],"hospital_name":"重庆五洲整形美容","img_cover":"","order_cnt":"0","pid":"1189","price_online":"11","price_origin":"200","title":"【玻尿酸导入】五洲整形<手术预约订金>专用项目"}],"hotProduct":[{"hospital_name":"xxxx","img_cover":"","lable":"安心购","order_cnt":"","pid":"","price_online":"","price_origin":"","title":"","type":"product"},{"hospital_name":"xxxx","img_cover":"","lable":"安心购","order_cnt":"","pid":"","price_online":"","price_origin":"","title":"","type":"product"},{"hospital_name":"xxxx","img_cover":"","lable":"安心购","order_cnt":"","pid":"","price_online":"","price_origin":"","title":"","type":"product"},{"hospital_name":"xxxx","img_cover":"","lable":"安心购","order_cnt":"","pid":"","price_online":"","price_origin":"","title":"","type":"product"}]}'
      );

      /***/
    },

    /***/ "5d54": /***/ function(module, exports, __webpack_require__) {
      // extracted by mini-css-extract-plugin
      /***/
    },

    /***/ "6dea": /***/ function(module, exports, __webpack_require__) {
      // extracted by mini-css-extract-plugin
      /***/
    },

    /***/ "8e6e": /***/ function(module, exports, __webpack_require__) {
      // https://github.com/tc39/proposal-object-getownpropertydescriptors
      var $export = __webpack_require__("5ca1");
      var ownKeys = __webpack_require__("990b");
      var toIObject = __webpack_require__("6821");
      var gOPD = __webpack_require__("11e9");
      var createProperty = __webpack_require__("f1ae");

      $export($export.S, "Object", {
        getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
          var O = toIObject(object);
          var getDesc = gOPD.f;
          var keys = ownKeys(O);
          var result = {};
          var i = 0;
          var key, desc;
          while (keys.length > i) {
            desc = getDesc(O, (key = keys[i++]));
            if (desc !== undefined) createProperty(result, key, desc);
          }
          return result;
        },
      });

      /***/
    },

    /***/ "983e": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_vue_vue_type_style_index_0_id_6e44cfa9_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "6dea"
      );
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_vue_vue_type_style_index_0_id_6e44cfa9_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_vue_vue_type_style_index_0_id_6e44cfa9_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__
      );
      /* unused harmony reexport * */

      /***/
    },

    /***/ "990b": /***/ function(module, exports, __webpack_require__) {
      // all object keys, includes non-enumerable and symbols
      var gOPN = __webpack_require__("9093");
      var gOPS = __webpack_require__("2621");
      var anObject = __webpack_require__("cb7c");
      var Reflect = __webpack_require__("7726").Reflect;
      module.exports =
        (Reflect && Reflect.ownKeys) ||
        function ownKeys(it) {
          var keys = gOPN.f(anObject(it));
          var getSymbols = gOPS.f;
          return getSymbols ? keys.concat(getSymbols(it)) : keys;
        };

      /***/
    },

    /***/ "9dba": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      // ESM COMPAT FLAG
      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"3a672da0-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/activity/views/newuser/activity_01.vue?vue&type=template&id=27f76de3&scoped=true&
      var render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "div",
          {
            staticClass: "newuser",
            class: {
              loading: _vm.page === 1 && _vm.isLoading,
              isshow: _vm.filterGroupShow,
            },
          },
          [
            _c(
              "ul",
              {
                staticClass: "selector",
                on: {
                  click: function($event) {
                    _vm.filterGroupShow = true;
                  },
                },
              },
              [
                _c(
                  "li",
                  {
                    on: {
                      click: function($event) {
                        _vm.selectedSort = "city";
                      },
                    },
                  },
                  [_vm._v(_vm._s(_vm.cityInfo.name))]
                ),
                _c(
                  "li",
                  {
                    on: {
                      click: function($event) {
                        _vm.selectedSort = "sort";
                      },
                    },
                  },
                  [_vm._v(_vm._s(_vm.sortInfo.name))]
                ),
              ]
            ),
            _vm.filterGroupShow
              ? _c("filter-group", {
                  attrs: {
                    selectedSort: _vm.selectedSort,
                    cityInfo: _vm.cityInfo,
                    sortInfo: _vm.sortInfo,
                    selectionSource: _vm.selectionSource,
                  },
                  on: {
                    close: function($event) {
                      _vm.filterGroupShow = false;
                    },
                    "select-city": function($event) {
                      _vm.selectedSort = "city";
                    },
                    "select-sort": function($event) {
                      _vm.selectedSort = "sort";
                    },
                    renderNewChange: _vm.renderFilterNewChange,
                  },
                })
              : _vm._e(),
            _c("div", { staticClass: "newuser__hotcake" }, [
              _c(
                "ul",
                { staticClass: "hotcake__product" },
                [
                  _vm._l(_vm.hotProduct, function(item, index) {
                    return [
                      item.pid
                        ? _c(
                            "li",
                            {
                              key: item.pid + "-" + index,
                              ref: "hotcake_product_item",
                              refInFor: true,
                              attrs: { pid: item.pid, index: index + 1 },
                              on: {
                                click: function($event) {
                                  return _vm.actToProductPage(item);
                                },
                              },
                            },
                            [
                              item.img_cover
                                ? _c("img", {
                                    directives: [
                                      {
                                        name: "lazy",
                                        rawName: "v-lazy",
                                        value: item.img_cover,
                                        expression: "item.img_cover",
                                      },
                                    ],
                                    staticClass: "hotcake__product--img",
                                    attrs: { alt: "" },
                                  })
                                : _c("div", {
                                    staticClass: "hotcake__product--img",
                                  }),
                              _c(
                                "div",
                                { staticClass: "hotcake__product--con" },
                                [
                                  _c(
                                    "p",
                                    { staticClass: "hotcake__product--title" },
                                    [_vm._v(_vm._s(item.title))]
                                  ),
                                  _c(
                                    "p",
                                    { staticClass: "hotcake__product--label" },
                                    [_vm._v("安心购")]
                                  ),
                                  _c(
                                    "p",
                                    { staticClass: "hotcake__product--num" },
                                    [
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "hotcake__product--online",
                                        },
                                        [
                                          _c(
                                            "i",
                                            {
                                              staticClass:
                                                "hotcake__online--unit",
                                            },
                                            [_vm._v("¥")]
                                          ),
                                          _vm._v(_vm._s(item.price_online)),
                                        ]
                                      ),
                                    ]
                                  ),
                                  _c(
                                    "p",
                                    { staticClass: "hotcake__product--footer" },
                                    [
                                      _c(
                                        "span",
                                        {
                                          staticClass: "hotcake__footer--name",
                                        },
                                        [_vm._v(_vm._s(item.hospital_name))]
                                      ),
                                      item.show_order_cnt > 0
                                        ? _c(
                                            "span",
                                            {
                                              staticClass:
                                                "hotcake__footer--sell",
                                            },
                                            [
                                              _vm._v(
                                                "已售" +
                                                  _vm._s(item.show_order_cnt) +
                                                  "件"
                                              ),
                                            ]
                                          )
                                        : _c(
                                            "span",
                                            {
                                              staticClass:
                                                "hotcake__footer--sell",
                                            },
                                            [_vm._v("新品上架")]
                                          ),
                                    ]
                                  ),
                                ]
                              ),
                            ]
                          )
                        : _vm._e(),
                    ];
                  }),
                ],
                2
              ),
            ]),
            _c(
              "div",
              {
                ref: "loadingMore",
                staticClass: "newuser__loading",
                class: { isios: _vm.$utils.isIos() },
              },
              [
                !_vm.has_more ? _c("span", [_vm._v("没有更多了哦")]) : _vm._e(),
                _vm.isLoading
                  ? _c("span", [_c("i"), _vm._v("加载中...")])
                  : _vm._e(),
              ]
            ),
          ],
          1
        );
      };
      var staticRenderFns = [];

      // CONCATENATED MODULE: ./src/pages/activity/views/newuser/activity_01.vue?vue&type=template&id=27f76de3&scoped=true&

      // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/toConsumableArray.js + 3 modules
      var toConsumableArray = __webpack_require__("75fc");

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.sort.js
      var es6_array_sort = __webpack_require__("55dd");

      // EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
      var runtime = __webpack_require__("96cf");

      // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js
      var asyncToGenerator = __webpack_require__("3b8d");

      // EXTERNAL MODULE: ./src/api/repeatPurchasing.js
      var repeatPurchasing = __webpack_require__("0b92");

      // EXTERNAL MODULE: ./src/api/newuser.js
      var newuser = __webpack_require__("f604");

      // EXTERNAL MODULE: ./src/components/filter-group/index.vue + 4 modules
      var filter_group = __webpack_require__("07e8");

      // EXTERNAL MODULE: ./src/pages/activity/views/newuser/mock.json
      var mock = __webpack_require__("5a61");

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/activity/views/newuser/activity_01.vue?vue&type=script&lang=js&

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

      /* harmony default export */ var activity_01vue_type_script_lang_js_ = {
        name: "newuser",
        data: function data() {
          return {
            hotProduct: [],
            hot_item: [],
            page: 1,
            cityId: 0,
            sort: 0,
            has_more: true,
            hasdone: false,
            isLoading: true,
            cityInfo: {
              name: "全部城市",
              id: 0,
            },
            sortInfo: {
              name: "智能排序",
              sort: 0,
            },
            selectedSort: "city",
            selectionSource: {},
            filterGroupShow: false,
          };
        },
        created: function created() {
          // 获取数据
          this.cityId = window.globalInfo.cityId || 0;
          this.hotProduct = mock.hotProduct;
          this.getSelectionData();
          this.getHotData();
        },
        mounted: function mounted() {
          var _this = this;

          this.$nextTick(function() {
            _this.onScroll();
          });
        },
        methods: {
          // 获取商品
          getHotData: (function() {
            var _getHotData = Object(asyncToGenerator["a" /* default */])(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
                var res, _res$data, list, has_more, _this$hotProduct;

                return regeneratorRuntime.wrap(
                  function _callee$(_context) {
                    while (1) {
                      switch ((_context.prev = _context.next)) {
                        case 0:
                          _context.prev = 0;
                          this.isLoading = true;
                          _context.next = 4;
                          return Object(
                            newuser["a" /* getCommonProductList */]
                          )({
                            page: this.page || 1,
                            cityId: this.cityId || 0,
                            sort: this.sort || 0,
                            price_online_min: 100,
                          });

                        case 4:
                          res = _context.sent;
                          this.isLoading = false;

                          if (res.status === 200) {
                            (_res$data = res.data),
                              (list = _res$data.list),
                              (has_more = _res$data.has_more);

                            if (this.page === 1) {
                              this.hotProduct = list;
                            } else {
                              (_this$hotProduct = this.hotProduct).push.apply(
                                _this$hotProduct,
                                Object(toConsumableArray["a" /* default */])(
                                  list
                                )
                              );
                            }

                            this.cityInfo = {
                              name: res.data.city_name || "全部城市",
                              id: this.cityId || 0,
                            };
                            this.has_more = has_more;
                          }

                          _context.next = 13;
                          break;

                        case 9:
                          _context.prev = 9;
                          _context.t0 = _context["catch"](0);
                          this.has_more = false;
                          this.$toast(_context.t0 || "获取商品接口报错");

                        case 13:
                        case "end":
                          return _context.stop();
                      }
                    }
                  },
                  _callee,
                  this,
                  [[0, 9]]
                );
              })
            );

            function getHotData() {
              return _getHotData.apply(this, arguments);
            }

            return getHotData;
          })(),
          //跳转商品详情页
          actToProductPage: function actToProductPage(item) {
            if (!item.pid) return;
            var ext = JSON.stringify(item.ext);

            if (this.$utils.isApp()) {
              if (this.$utils.isIos()) {
                window.location.href = "app.soyoung://yuehui/productdetail?pid="
                  .concat(
                    item.pid,
                    "&from_action=sy_m_home_new_sell:sku_click&ext="
                  )
                  .concat(ext);
              } else {
                window.location.href = "app.soyoung://product?pid="
                  .concat(
                    item.pid,
                    "&from_action=sy_m_home_new_sell:sku_click&ext="
                  )
                  .concat(ext);
              }
            } else {
              window.location.href = "https://"
                .concat(window.location.host, "/normal/cpwap")
                .concat(
                  item.pid,
                  "/?from_action=sy_m_home_new_sell:sku_click&ext="
                )
                .concat(ext);
            }
          },
          onScroll: function onScroll() {
            var _this2 = this;

            var dom = this.$refs.loadingMore;
            var observer = new IntersectionObserver(
              function(entries) {
                if (
                  entries[0].intersectionRatio > 0 &&
                  _this2.has_more &&
                  !_this2.isLoading
                ) {
                  _this2.page++;

                  _this2.getHotData();
                }
              },
              {
                root: null,
                threshold: 0.1,
              }
            );
            observer.observe(dom);
          },
          // 选择筛选项
          renderFilterNewChange: function renderFilterNewChange(type, data) {
            this[type + "Info"] = data; // 异步更新数据

            if (type === "city") this.cityId = data.id;
            if (type === "sort") this.sort = data.sort;
            this.hotProduct = [];
            this.filterGroupShow = false;
            this.page = 1;
            this.getHotData();
          },
          // 获取筛选列表数据
          getSelectionData: (function() {
            var _getSelectionData = Object(asyncToGenerator["a" /* default */])(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee2() {
                var _yield$getFilterData, errorCode, errorMsg, responseData;

                return regeneratorRuntime.wrap(
                  function _callee2$(_context2) {
                    while (1) {
                      switch ((_context2.prev = _context2.next)) {
                        case 0:
                          _context2.next = 2;
                          return Object(
                            repeatPurchasing["c" /* getFilterData */]
                          )();

                        case 2:
                          _yield$getFilterData = _context2.sent;
                          errorCode = _yield$getFilterData.errorCode;
                          errorMsg = _yield$getFilterData.errorMsg;
                          responseData = _yield$getFilterData.responseData;

                          if (errorCode === 0) {
                            this.selectionSource = responseData || {};
                          } else {
                            this.$toast(errorMsg || "接口错误，请重试");
                          }

                        case 7:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  },
                  _callee2,
                  this
                );
              })
            );

            function getSelectionData() {
              return _getSelectionData.apply(this, arguments);
            }

            return getSelectionData;
          })(),
        },
        components: {
          filterGroup: filter_group["a" /* default */],
        },
      };
      // CONCATENATED MODULE: ./src/pages/activity/views/newuser/activity_01.vue?vue&type=script&lang=js&
      /* harmony default export */ var newuser_activity_01vue_type_script_lang_js_ = activity_01vue_type_script_lang_js_;
      // EXTERNAL MODULE: ./src/pages/activity/views/newuser/activity_01.vue?vue&type=style&index=0&lang=less&
      var activity_01vue_type_style_index_0_lang_less_ = __webpack_require__(
        "e192"
      );

      // EXTERNAL MODULE: ./src/pages/activity/views/newuser/activity_01.vue?vue&type=style&index=1&id=27f76de3&lang=less&scoped=true&
      var activity_01vue_type_style_index_1_id_27f76de3_lang_less_scoped_true_ = __webpack_require__(
        "0843"
      );

      // EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
      var componentNormalizer = __webpack_require__("2877");

      // CONCATENATED MODULE: ./src/pages/activity/views/newuser/activity_01.vue

      /* normalize component */

      var component = Object(componentNormalizer["a" /* default */])(
        newuser_activity_01vue_type_script_lang_js_,
        render,
        staticRenderFns,
        false,
        null,
        "27f76de3",
        null
      );

      /* harmony default export */ var activity_01 = (__webpack_exports__[
        "default"
      ] = component.exports);

      /***/
    },

    /***/ bd86: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "a",
        function() {
          return _defineProperty;
        }
      );
      /* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "85f2"
      );
      /* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__
      );

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default()(
            obj,
            key,
            {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            }
          );
        } else {
          obj[key] = value;
        }

        return obj;
      }

      /***/
    },

    /***/ d12a: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"3a672da0-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/filter-group/city.vue?vue&type=template&id=6e44cfa9&scoped=true&
      var render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "filter-city" }, [
          _c(
            "div",
            { staticClass: "city__nav" },
            _vm._l(_vm.list, function(nav, index) {
              return _c(
                "span",
                {
                  key: nav.name,
                  staticClass: "city__nav--item",
                  class: { "is-active": +index === +_vm.provinceIndex },
                  on: {
                    click: function($event) {
                      return _vm.getChildCity(nav, index);
                    },
                  },
                },
                [_vm._v("\n      " + _vm._s(nav.name) + "\n    ")]
              );
            }),
            0
          ),
          _c(
            "div",
            { staticClass: "city__btn" },
            [
              _vm.cityList.length > 1
                ? _vm._l(_vm.cityList, function(item, index) {
                    return _c(
                      "span",
                      {
                        key: item.value_cnt,
                        staticClass: "city__btn--item",
                        class: { "is-active": +item.id === +_vm.cityInfo.id },
                        on: {
                          click: function($event) {
                            return _vm.getCityIndex(index);
                          },
                        },
                      },
                      [_vm._v("\n        " + _vm._s(item.name) + "\n      ")]
                    );
                  })
                : _vm._e(),
            ],
            2
          ),
        ]);
      };
      var staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/filter-group/city.vue?vue&type=template&id=6e44cfa9&scoped=true&

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js
      var es7_object_get_own_property_descriptors = __webpack_require__("8e6e");

      // EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
      var web_dom_iterable = __webpack_require__("ac6a");

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
      var es6_object_keys = __webpack_require__("456d");

      // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js
      var defineProperty = __webpack_require__("bd86");

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/filter-group/city.vue?vue&type=script&lang=js&

      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
          }
          keys.push.apply(keys, symbols);
        }
        return keys;
      }

      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
              Object(defineProperty["a" /* default */])(
                target,
                key,
                source[key]
              );
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
              target,
              Object.getOwnPropertyDescriptors(source)
            );
          } else {
            ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(
                target,
                key,
                Object.getOwnPropertyDescriptor(source, key)
              );
            });
          }
        }
        return target;
      }
      /* harmony default export */ var cityvue_type_script_lang_js_ = {
        name: "city-list",
        data: function data() {
          return {
            provinceIndex: 0,
            //当前省份索引
            cityIndex: 0,
            //当前城市索引
            cityList: [],
            //
            province_id: 0, //当前省份id
          };
        },
        props: {
          list: {},
          cityInfo: {},
        },
        mounted: function mounted() {
          this.provinceIndex = +this.cityInfo.provinceIndex || 0;
          this.renderCityList();
        },
        // watch:{  },
        methods: {
          renderCityList: function renderCityList() {
            if (!this.list) return;

            if (!this.cityInfo.provinceIndex) {
              this.cityList = this.list[0].son || [];
              return;
            }

            console.log("+this.cityInfo.upid", this.cityInfo);
            var provinceData = this.list[this.cityInfo.provinceIndex];
            if (!provinceData || provinceData.length === 0)
              provinceData = this.list;
            console.log("provinceData", provinceData);
            this.cityList = provinceData.son || [];
          },
          // 获取城市列表
          getChildCity: function getChildCity(item, index) {
            //左边为热门城市，省份Id传0
            this.province_id = index == 0 ? 0 : item.id;
            this.provinceIndex = index;
            this.cityList = item.son || [];

            if (this.cityList.length === 1) {
              this.$emit(
                "getSelected",
                _objectSpread(
                  _objectSpread({}, this.cityList[0]),
                  {},
                  {
                    provinceIndex: this.provinceIndex,
                    province_id: this.province_id,
                  }
                )
              );
            }
          },
          // 获取当前城市
          getCityIndex: function getCityIndex(index) {
            this.cityIndex = index;
            this.$emit(
              "getSelected",
              _objectSpread(
                _objectSpread({}, this.cityList[index]),
                {},
                {
                  provinceIndex: this.provinceIndex,
                  province_id: this.province_id,
                }
              )
            );
          },
        },
      };
      // CONCATENATED MODULE: ./src/components/filter-group/city.vue?vue&type=script&lang=js&
      /* harmony default export */ var filter_group_cityvue_type_script_lang_js_ = cityvue_type_script_lang_js_;
      // EXTERNAL MODULE: ./src/components/filter-group/city.vue?vue&type=style&index=0&id=6e44cfa9&lang=less&scoped=true&
      var cityvue_type_style_index_0_id_6e44cfa9_lang_less_scoped_true_ = __webpack_require__(
        "983e"
      );

      // EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
      var componentNormalizer = __webpack_require__("2877");

      // CONCATENATED MODULE: ./src/components/filter-group/city.vue

      /* normalize component */

      var component = Object(componentNormalizer["a" /* default */])(
        filter_group_cityvue_type_script_lang_js_,
        render,
        staticRenderFns,
        false,
        null,
        "6e44cfa9",
        null
      );

      /* harmony default export */ var city = (__webpack_exports__["a"] =
        component.exports);

      /***/
    },

    /***/ d4ab: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1befa301_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "5d54"
      );
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1befa301_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1befa301_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__
      );
      /* unused harmony reexport * */

      /***/
    },

    /***/ e192: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_01_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "3ddb"
      );
      /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_01_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_css_loader_index_js_ref_10_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_01_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__
      );
      /* unused harmony reexport * */

      /***/
    },

    /***/ f1ae: /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var $defineProperty = __webpack_require__("86cc");
      var createDesc = __webpack_require__("4630");

      module.exports = function(object, index, value) {
        if (index in object)
          $defineProperty.f(object, index, createDesc(0, value));
        else object[index] = value;
      };

      /***/
    },

    /***/ f604: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "c",
        function() {
          return getNewuserProduct;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "b",
        function() {
          return getHot;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "d",
        function() {
          return recordId;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "a",
        function() {
          return getCommonProductList;
        }
      );
      /* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "c1fb"
      );
      // 获取新人超低价商品

      var getNewuserProduct = function getNewuserProduct(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/NewerRecommend/Index",
          method: "post",
        });
      }; // 获取爆款补贴区

      var getHot = function getHot(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/NewerRecommend/Hot",
          method: "post",
        });
      }; // 记录点击的类目

      var recordId = function recordId(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/NewerRecommend/RecordView",
          method: "post",
        });
      };
      var getCommonProductList = function getCommonProductList(params) {
        return Object(_http__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
          data: params,
          url: "/indexUser/commonProductList",
          method: "post",
        });
      };

      /***/
    },
  },
]);

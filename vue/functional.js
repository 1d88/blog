(window.webpackJsonp = window.webpackJsonp || []).push([
  [30],
  {
    489: function(t, n, o) {},
    540: function(t, n, o) {
      "use strict";
      o(489);
    },
    585: function(t, n, o) {
      "use strict";
      o.r(n);
      o(540);
      var c = o(11),
        component = Object(c.a)(
          {},
          function(t, n) {
            var o = n._c;
            return o(
              "div",
              {
                staticClass: "violation",
                class: [n.props.showDelete ? "show-del" : ""],
                on: { click: n.listeners.onTap },
              },
              [
                o("div", {
                  staticClass: "close",
                  on: {
                    click: function(t) {
                      return t.stopPropagation(), n.listeners.onDel(t);
                    },
                  },
                }),
                n._v(" "),
                o("p", [
                  o("img", {
                    attrs: {
                      src:
                        "https://static.soyoung.com/sy-pre/waring-1628824200682.png",
                      alt: "waring",
                    },
                  }),
                  n._v("\n    " + n._s(n.props.violation_text) + "\n  "),
                ]),
              ]
            );
          },
          [],
          !0,
          null,
          "2a6cd722",
          null
        );
      n.default = component.exports;
    },
  },
]);

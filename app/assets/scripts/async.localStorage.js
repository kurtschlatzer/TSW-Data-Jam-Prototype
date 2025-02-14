(function (a, b, c) {
  "use strict";
  c = !! c;
  var d, f, e = b.MutationObserver || b.WebKitMutationObserver;
  if ("undefined" != typeof process && "[object process]" === {}.toString.call(process)) d = function (a, b) {
    process.nextTick(function () {
      a.call(b)
    })
  };
  else if (e) {
    var g = [],
      h = new e(function () {
        var a = g.slice();
        g = [], a.forEach(function (a) {
          a[0].call(a[1])
        })
      }),
      i = document.createElement("div");
    h.observe(i, {
      attributes: !0
    }), window.addEventListener("unload", function () {
      h.disconnect(), h = null
    }), d = function (a, b) {
      g.push([a, b]), i.setAttribute("drainQueue", "drainQueue")
    }
  } else d = function (a, b) {
    setTimeout(function () {
      a.call(b)
    }, 1)
  };
  var j = function (a) {
    return {
      enumerable: !0,
      configurable: !1,
      get: a
    }
  }, k = function (a, b, c, d) {
      return {
        enumerable: !! b,
        configurable: true,
        writable: true,
        value: a || function () {}
      }
    }, l = function (a) {
      return k(a, 0, 1, 0)
    }, m = function (a) {
      return k(a, 1)
    }, n = function (a) {
      try {
        var b = a.then;
        if ("function" == typeof b) return !0
      } catch (c) {}
      return !1
    }, o = function (a) {
      Error.call(this, a)
    };
  o.prototype = Object.create(Error.prototype);
  var p = function () {
    var a = [];
    return a.pump = function (b) {
      d(function () {
        for (var c = a.length, d = 0; c > d;) d++, a.shift()(b)
      })
    }, a
  }, q = function (a, b, e, f, g, h) {
      var i = !1,
        k = this,
        l = function (a) {
          d(function () {
            h("fulfilled"), f(a), b.pump(a)
          })
        }, m = function (a) {
          d(function () {
            h("rejected"), g(a), e.pump(a)
          })
        }, o = function (a) {
          return n(a) ? (a.then(o, m), void 0) : (l(a), void 0)
        }, p = function (a) {
          return function (b) {
            i ? "undefined" != typeof console && console.error("Cannot resolve a Promise multiple times.") : (i = !0, a(b))
          }
        };
      this.resolve = p(o, "resolve"), this.fulfill = p(l, "fulfill"), this.reject = p(m, "reject"), this.cancel = function () {
        k.reject(Error("Cancel"))
      }, this.timeout = function () {
        k.reject(Error("Timeout"))
      }, c && Object.defineProperties(this, {
        _isResolved: j(function () {
          return i
        })
      }), h("pending")
    }, f = function (a) {
      var e, f, b = new p,
        d = new p,
        g = "pending";
      c && Object.defineProperties(this, {
        _value: j(function () {
          return e
        }),
        _error: j(function () {
          return f
        }),
        _state: j(function () {
          return g
        })
      }), Object.defineProperties(this, {
        _addAcceptCallback: l(function (a) {
          b.push(a), "fulfilled" == g && b.pump(e)
        }),
        _addRejectCallback: l(function (a) {
          d.push(a), "rejected" == g && d.pump(f)
        })
      });
      var h = new q(this, b, d, function (a) {
        e = a
      }, function (a) {
        f = a
      }, function (a) {
        g = a
      });
      try {
        a && a(h)
      } catch (i) {
        h.reject(i)
      }
    }, r = function (a) {
      return "function" == typeof a
    }, s = function (a, b, c) {
      return r(a) ? function () {
        try {
          var c = a.apply(null, arguments);
          b.resolve(c)
        } catch (d) {
          b.reject(d)
        }
      } : b[c].bind(b)
    }, t = function (a, b, c) {
      return r(a) && c._addAcceptCallback(a), r(b) && c._addRejectCallback(b), c
    };
  f.prototype = Object.create(null, {
    then: m(function (a, b) {
      var c = this;
      return new f(function (d) {
        t(s(a, d, "resolve"), s(b, d, "reject"), c)
      })
    }),
    "catch": m(function (a) {
      var b = this;
      return new f(function (c) {
        t(null, s(a, c, "reject"), b)
      })
    })
  }), f.isThenable = n;
  var u = function (a) {
    return Array.prototype.slice.call(a).map(f.resolve)
  };
  f.any = function () {
    var a = u(arguments);
    return new f(function (b) {
      if (a.length) {
        var c = !1,
          d = function (a) {
            c || (c = !0, b.resolve(a))
          }, e = function (a) {
            c || (c = !0, b.reject(a))
          };
        a.forEach(function (a) {
          a.then(d, e)
        })
      } else b.reject("No futures passed to Promise.any()")
    })
  }, f.every = function () {
    var a = u(arguments);
    return new f(function (b) {
      if (a.length) {
        var c = Array(a.length),
          d = 0,
          e = function (e, f) {
            d++, c[e] = f, d == a.length && b.resolve(c)
          };
        a.forEach(function (a, c) {
          a.then(e.bind(null, c), b.reject)
        })
      } else b.reject("No futures passed to Promise.every()")
    })
  }, f.some = function () {
    var a = u(arguments);
    return new f(function (b) {
      if (a.length) {
        var c = 0,
          d = function () {
            c++, c == a.length && b.reject()
          };
        a.forEach(function (a) {
          a.then(b.resolve, d)
        })
      } else b.reject("No futures passed to Promise.some()")
    })
  }, f.fulfill = function (a) {
    return new f(function (b) {
      b.fulfill(a)
    })
  }, f.resolve = function (a) {
    return new f(function (b) {
      b.resolve(a)
    })
  }, f.reject = function (a) {
    return new f(function (b) {
      b.reject(a)
    })
  }, a.Promise = f
})(this, "undefined" != typeof window ? window : {}, this.runningUnderTest || !1),
function (a, b) {
  "use strict";
  if (void 0 !== a.window && a.window === a && void 0 !== a.indexedDB) {
    var c = "async_local_storage",
      d = "als_objects",
      e = 1,
      f = null,
      g = {};
    g.tail = new Promise(function (a) {
      a.fulfill()
    }), g.add = function (a, b) {
      var c = g.tail,
        d = function () {
          return q().then(function () {
            var c = new Promise(function (b) {
              m(a, b)
            });
            return b === !0 ? c : new Promise(function (a) {
              var b = a.fulfill.bind(a);
              setTimeout(function () {
                c.then(b, b)
              }, 1)
            })
          })
        };
      return g.tail = c.then(d, d)
    };
    var i, j, o, h = function (a) {
        return a
      }, k = function () {
        i = null, j = null
      }, l = b.userAgent.match(/Firefox\/\d+(\.\d+)/) instanceof Array,
      m = function (a, b) {
        var c = a.operation,
          e = a.transform || h;
        if (l && i && j) try {
          j.count()
        } catch (g) {
          console.log("  store.count failed = ("), console.log("  clearTrans();"), k()
        }
        i || (i = f.transaction([d], "readwrite"), j = i.objectStore(d), i.onabort = i.onerror = i.oncomplete = k);
        var m = null,
          n = function (a) {
            b.resolve(e(a))
          }, o = function (a) {
            b.reject(a)
          };
        switch (c) {
        case "get":
          m = j.get(a.key);
          break;
        case "set":
          m = j.put(a.value, a.key);
          break;
        case "delete":
          m = j.delete(a.key);
          break;
        case "clear":
          m = j.clear();
          break;
        case "has":
          m = j.count(a.key);
          break;
        case "count":
          m = j.count();
          break;
        case "forEach":
          return m = j.openCursor(), m.onsuccess = function (b) {
            var c = b.target.result;
            if (c) {
              try {
                a.callback.call(a.scope || null, c.value, c.key)
              } catch (d) {
                return o(d), void 0
              }
              c.
              continue ()
            } else n()
          }, m.onerror = o, void 0
        }
        return m ? (m.onsuccess = function () {
          n(m.result)
        }, m.onerror = o, void 0) : (o(Error("IDB Request Failed")), void 0)
      }, n = !1,
      p = new Promise(function (a) {
        o = a
      }),
      q = function () {
        if (n) return p;
        n = !0;
        var b = a.indexedDB.open(c, e);
        return b.onupgradeneeded = function (a) {
          f = a.target.result, f.createObjectStore(d)
        }, b.onsuccess = function (a) {
          f = a.target.result, o.resolve(a)
        }, b.onfailure = o.reject.bind(o), p
      }, r = function (a) {
        return {
          configurable: !0,
          enumerable: !1,
          writable: !1,
          value: a
        }
      }, s = b.alsPolyfillStorage = Object.create(null, {
        has: r(function (a) {
          return g.add({
            operation: "has",
            key: a,
            transform: function (a) {
              return !!a
            }
          })
        }),
        set: r(function (a, b) {
          return g.add({
            operation: "set",
            key: a,
            value: b
          })
        }),
        get: r(function (a) {
          return g.add({
            operation: "get",
            key: a
          })
        }),
        "delete": r(function (a) {
          return g.add({
            operation: "delete",
            key: a
          })
        }),
        clear: r(function () {
          return g.add({
            operation: "clear"
          })
        }),
        count: r(function () {
          return g.add({
            operation: "count"
          })
        }),
        forEach: r(function (a, b) {
          return g.add({
            operation: "forEach",
            callback: function (b, c) {
              a(b, c, s)
            },
            scope: b
          }, !0)
        })
      })
  }
}(this, this.navigator || {});

/**
* nQuery 0.3.0
* @license MIT
* https://github.com/dangeredwolf/nQuery
**/
(function (exports) {
	'use strict';

	let prom = Promise;
	prom.prototype.done = prom.prototype.then;
	prom.prototype.fail = prom.prototype.catch;
	prom.prototype.always = prom.prototype.finally;
	let nQueryPromise = prom;

	var ajax = ((...a) => {
	  var request = new XMLHttpRequest();
	  let promise = new nQueryPromise((resolve, reject) => {
	    let settings = a[1] ? a[1] : a[0];

	    if (typeof a[0] === "string") {
	      if (typeof a[1] !== "object") {
	        settings = {
	          url: a[0]
	        };
	      } else {
	        settings.url = a[0];
	      }
	    }

	    request.open(settings.method || "GET", settings.url, typeof settings.async === "undefined" ? true : settings.async, settings.username, settings.password);

	    if (settings.dataType) {
	      request.overrideMimeType(settings.dataType);
	    }

	    request.addEventListener("load", () => {
	      var res = request.responseText;

	      try {
	        res = JSON.parse(res);
	      } catch (e) {}

	      resolve(res);
	    });
	    request.addEventListener("error", reject);
	    request.addEventListener("abort", reject);
	    let str;

	    if (typeof request.body === "object") {
	      str = JSON.stringify(request.body);
	    } else {
	      str = request.body;
	    }

	    request.send(str);
	  });
	  return promise;
	});

	// Stub, for now.
	var ajaxPrefilter = (() => {});

	// Stub, for now.
	var ajaxSuccess = (() => {});

	var extend = ((target, ...args) => {
	  args.forEach(prop => Object.assign(target, prop));
	});

	var now = (() => Date.now());

	var type = (object => typeof object);

	var support = (object => {
	});

	// stub right now;
	var when = (object => object);

	var version = "0.3.0";

	var ready = ((objects, func) => {
	  if (nQuery.__ready) {
	    (func ? func : objects || (() => {}))();
	  } else {
	    nQuery.__internal_r.push(func);
	  }
	});

	var add = ((objects, add) => {
	  let newElems = nQuery$1(add);
	  newElems.forEach(elem => objects.push(elem));
	  return objects;
	});

	class nQueryObject extends Array {
	  constructor(objects) {
	    super();
	    Object.assign(this, $.fn); // for X in Y loops are somehow unbelievably slow here.. it's kinda amazing... so instead we use a fast incremental loop

	    for (var i = 0; i < objects.length; i++) {
	      this[i] = objects[i];
	    }
	  }

	}

	class nQueryElement extends nQueryObject {
	  constructor(objects) {
	    super(objects);
	  }

	}

	function normalizeElementArray(obj) {
	  // don't forget that nQueryObject is an instance of Array
	  // https://stackoverflow.com/questions/22289727/difference-between-using-array-isarray-and-instanceof-array
	  if (obj === null) {
	    return [];
	  } else if (obj instanceof Array || obj instanceof NodeList || obj instanceof HTMLCollection || obj instanceof nQueryElement) {
	    if (typeof obj[0] === "string") {
	      return document.querySelectorAll(obj[0]);
	    }

	    return obj;
	  } else if (obj instanceof HTMLElement) {
	    return [obj];
	  } else if (typeof obj === "string") {
	    if (obj.match(/<.+>/g) === null) {
	      try {
	        return document.querySelectorAll(obj);
	      } catch (e) {
	        console.error(e);
	        return [];
	      }
	    } else {
	      return renderHTML(obj);
	    }
	  } else if (typeof obj !== "undefined") {
	    console.warn("Someone passed me a non-element object?");
	    console.info(obj);
	    return [obj];
	  }

	  return [];
	}
	function splitCSSClasses(...a) {
	  let r = [];
	  a.forEach(i => {
	    if (typeof i === "string") r = i.split(" ");else if (i instanceof Array) i.forEach(j => r.push(j.split(" ")));
	  });
	  return r;
	}
	function renderHTML(html) {
	  let temp = document.createElement("div");
	  temp.innerHTML = html;
	  let object = temp.children;
	  temp.remove();
	  return object;
	}

	var addClass = ((objects, ...classes) => {
	  objects.forEach(obj => splitCSSClasses(classes).forEach(classy => obj.classList.add(classy)));
	  return objects;
	});

	var after = ((objects, ...elements) => {
	  normalizeElementArray(elements).forEach(element => {
	    var _objects$;

	    (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.insertAdjacentElement('afterend', element);
	  });
	  return objects;
	});

	var append = ((objects, ...elements) => {
	  objects.forEach(obj => elements.forEach(element => {
	    var _normalizeElementArra, _normalizeElementArra2;

	    (_normalizeElementArra = normalizeElementArray(element)) === null || _normalizeElementArra === void 0 ? void 0 : (_normalizeElementArra2 = _normalizeElementArra.forEach) === null || _normalizeElementArra2 === void 0 ? void 0 : _normalizeElementArra2.call(_normalizeElementArra, realElement => realElement && obj.appendChild(realElement));
	  }));
	  return objects;
	});

	var attr = ((objects, attr, value) => {
	  let attrObject = {};
	  let useValue = typeof value !== "undefined";

	  if (typeof attr === "object") {
	    attrObject = attr;
	    useValue = true;
	  } else {
	    attrObject[attr] = value;
	  }

	  if (useValue) {
	    for (let i in attrObject) {
	      console.log(i);
	      objects.forEach(obj => obj.setAttribute(i, attrObject[i]));
	    }
	  } else {
	    if (objects[0]) {
	      return objects[0].getAttribute(attr) || undefined;
	    }
	  }

	  console.log(objects);
	  return objects;
	});

	var children = ((objects, matches) => {
	  let results = [];
	  objects.forEach(obj => {
	    for (let i = 0; i < ((_obj$children = obj.children) === null || _obj$children === void 0 ? void 0 : _obj$children.length); i++) {
	      var _obj$children;

	      if (!matches || obj.children[i].matches(matches)) {
	        results.push(obj.children[i]);
	      }
	    }
	  });
	  return nQuery$1(results);
	});

	var eventHandler = ((eventName, objects, ...args) => {
	  objects.forEach(obj => args.length <= 0 ? obj.dispatchEvent(new Event(eventName, ...args)) : obj.addEventListener(eventName, ...args));
	  return objects;
	});

	var css = ((objects, css, value) => {
	  if (value || typeof css === "object" && !(css instanceof Array)) {
	    if (value) {
	      objects.forEach(obj => obj.style[css] = typeof value === "number" ? value + "px" : value);
	    } else {
	      for (let i in css) {
	        objects.forEach(obj => obj.style[i] = typeof css[i] === "number" ? css[i] + "px" : css[i]);
	      }
	    }
	  } else {
	    if (typeof css === "string") {
	      return getComputedStyle(objects[0]).getPropertyValue(css);
	    } else if (typeof css === "object") {
	      let results = {};
	      let compStyles = getComputedStyle(objects[0]);
	      css === null || css === void 0 ? void 0 : css.forEach(property => {
	        results[property] = compStyles.getPropertyValue(property);
	      });
	      return results;
	    }
	  }
	});

	var data = ((objects, tag, value) => {
	  if (typeof value === "undefined") {
	    var _objects$, _objects$$getAttribut;

	    return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : (_objects$$getAttribut = _objects$.getAttribute) === null || _objects$$getAttribut === void 0 ? void 0 : _objects$$getAttribut.call(_objects$, "data-" + tag);
	  }

	  objects.forEach(obj => {
	    var _obj$setAttribute;

	    return obj === null || obj === void 0 ? void 0 : (_obj$setAttribute = obj.setAttribute) === null || _obj$setAttribute === void 0 ? void 0 : _obj$setAttribute.call(obj, "data-" + tag, value);
	  });
	  return objects;
	});

	var each = ((objects, func) => {
	  objects.forEach((obj, i) => {
	    func === null || func === void 0 ? void 0 : func(i);
	  });
	  return objects;
	});

	var find = ((objects, matches) => {
	  let results = [];

	  let find = obj => {
	    if (obj.children) {
	      for (let i = 0; i < obj.children.length; i++) {
	        if (obj.children[i].matches(matches)) {
	          results.push(obj.children[i]);
	        }

	        find(obj.children[i]);
	      }
	    }
	  };

	  objects.forEach(obj => find(obj));
	  return nQuery$1(results);
	});

	var first = (objects => nQuery$1([objects[0]]));

	var hasClass = ((objects, ...args) => {
	  let result = false;
	  objects.forEach(obj => splitCSSClasses(args).forEach(cssClasses => {
	    var _obj$classList;

	    return result = result || ((_obj$classList = obj.classList) === null || _obj$classList === void 0 ? void 0 : _obj$classList.contains(cssClasses));
	  }));
	  return result;
	});

	var height = ((objects, set) => {
	  if (set) {
	    objects.forEach(obj => obj.style.height = typeof set === "string" ? set : set + "px");
	  } else {
	    try {
	      return parseFloat(getComputedStyle(objects[0], null).height.replace("px", ""));
	    } catch (e) {
	      var _objects$;

	      return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.offsetHeight;
	    }
	  }
	});

	var hide = (objects => {
	  objects.forEach(obj => obj.style.display = "none");
	  return objects;
	});

	var html = ((objects, value) => {
	  if (typeof value === "undefined") {
	    var _objects$;

	    return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.innerHTML;
	  }

	  objects.forEach(obj => {
	    obj.innerHTML = value;
	  });
	  return objects;
	});

	var insertBefore = ((objects, ...elements) => {
	  objects.forEach(obj => elements.forEach(element => normalizeElementArray(element).forEach(realElement => obj.insertBefore(realElement))));
	  return objects;
	});

	var is = ((objects, selector) => {
	  let result = false;
	  objects.forEach(obj => {
	    var _obj$matches;

	    result = result || ((_obj$matches = obj.matches) === null || _obj$matches === void 0 ? void 0 : _obj$matches.call(obj, selector));
	  });
	  return result;
	});

	var next = (objects => {
	  var _objects$;

	  return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.nextElementSibling;
	});

	var on = ((objects, eventName, ...args) => {
	  objects.forEach(obj => {
	    obj.__nq_event = obj.__nq_event || [];

	    obj.__nq_event.push(obj.addEventListener(eventName, ...args));
	  });
	  return objects;
	});

	var one = ((objects, eventName, func, ...args) => {
	  objects.forEach(obj => {
	    obj.addEventListener(eventName, e => {
	      obj.removeEventListener(eventName);
	      func(e);
	    }, ...args);
	  });
	  return objects;
	});

	var off = ((objects, eventName, ...args) => {
	  // Remove all event listeners if not passed with eventName
	  objects.forEach(obj => {
	    if (typeof obj.__nq_event === "undefined") {
	      return;
	    }

	    if (!eventName) {
	      for (let i = 0; i < obj.__nq_event.length; i++) {
	        var e = obj.__nq_event[i];
	        obj.removeEventListener(e.type, e);
	      }
	    } else {
	      splitCSSClasses(eventName).forEach(eventNames => {
	        for (let i = 0; i < obj.__nq_event.length; i++) {
	          var e = obj.__nq_event[i];

	          if (e.type === eventNames) {
	            obj.removeEventListener(e.type, e);
	          }
	        }
	      });
	      objects.forEach(obj => obj.removeEventListener(eventName, ...args));
	    }
	  });
	  return objects;
	});

	var outerHeight = (objects => {
	  var _objects$;

	  return ((_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.offsetHeight) || objects;
	});

	var outerWidth = (objects => {
	  var _objects$;

	  return ((_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.offsetWidth) || objects;
	});

	var parents = ((objects, matches) => {
	  let results = [];
	  let obj = objects[0];

	  while (obj && obj.nodeName !== "HTML") {
	    results.push(obj);
	    obj = obj.parentElement;
	  }

	  return nQuery$1(results);
	});

	var parent = (objects => {
	  var _objects$;

	  return nQuery$1((_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.parentElement);
	});

	var position = (objects => {
	  var _objects$, _objects$2;

	  return {
	    left: (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.offsetLeft,
	    top: (_objects$2 = objects[0]) === null || _objects$2 === void 0 ? void 0 : _objects$2.offsetTop
	  };
	});

	var prepend = ((objects, ...elements) => {
	  objects.forEach(obj => elements.forEach(element => {
	    var _normalizeElementArra;

	    return (_normalizeElementArra = normalizeElementArray(element)) === null || _normalizeElementArra === void 0 ? void 0 : _normalizeElementArra.forEach(realElement => obj.insertBefore(realElement, obj === null || obj === void 0 ? void 0 : obj.firstChild));
	  }));
	  return objects;
	});

	var prev = (objects => {
	  var _objects$;

	  return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.previousElementSibling;
	});

	var remove = (objects => {
	  objects.forEach(obj => obj === null || obj === void 0 ? void 0 : obj.remove());
	  return objects;
	});

	var removeAttr = ((objects, ...args) => {
	  objects.forEach(obj => args.forEach(attr => obj.removeAttribute(attr)));
	  return objects;
	});

	var removeClass = ((objects, ...args) => {
	  objects.forEach(obj => splitCSSClasses(args).forEach(cssClass => {
	    var _obj$classList, _obj$classList$remove;

	    return obj === null || obj === void 0 ? void 0 : (_obj$classList = obj.classList) === null || _obj$classList === void 0 ? void 0 : (_obj$classList$remove = _obj$classList.remove) === null || _obj$classList$remove === void 0 ? void 0 : _obj$classList$remove.call(_obj$classList, cssClass);
	  }));
	  return objects;
	});

	var replaceWith = ((objects, value) => {
	  objects.forEach(obj => obj.outerHTML = value);
	  return objects;
	});

	var show = (objects => {
	  objects.forEach(obj => obj.style.display = null);
	  return objects;
	});

	var siblings = (objects => {
	  let results = [];
	  objects.forEach(obj => {
	    var _obj$parentNode, _obj$parentNode$child, _obj$parentNode$child2;

	    obj === null || obj === void 0 ? void 0 : (_obj$parentNode = obj.parentNode) === null || _obj$parentNode === void 0 ? void 0 : (_obj$parentNode$child = _obj$parentNode.children) === null || _obj$parentNode$child === void 0 ? void 0 : (_obj$parentNode$child2 = _obj$parentNode$child.forEach) === null || _obj$parentNode$child2 === void 0 ? void 0 : _obj$parentNode$child2.call(_obj$parentNode$child, child => {
	      if (child !== obj) {
	        results.push(child);
	      }
	    });
	  });
	  return nQuery$1(results);
	});

	var text = ((objects, value) => {
	  if (typeof value === "undefined") {
	    var _objects$;

	    return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.innerText;
	  }

	  objects.forEach(obj => {
	    obj.innerText = value;
	  });
	  return objects;
	});

	var toggleClass = ((objects, ...args) => {
	  objects.forEach(obj => splitCSSClasses(args).forEach(cssClass => {
	    var _obj$classList, _obj$classList$toggle;

	    return (_obj$classList = obj.classList) === null || _obj$classList === void 0 ? void 0 : (_obj$classList$toggle = _obj$classList.toggle) === null || _obj$classList$toggle === void 0 ? void 0 : _obj$classList$toggle.call(_obj$classList, cssClass);
	  }));
	  return objects;
	});

	var trigger = ((objects, eventName, ...args) => {
	  objects.forEach(obj => {
	    obj.dispatchEvent(new Event(eventName, ...args));
	  });
	  return objects;
	});

	var width = ((objects, set) => {
	  if (set) {
	    objects.forEach(obj => obj.style.width = typeof set === "string" ? set : set + "px");
	  } else {
	    try {
	      return parseFloat(getComputedStyle(objects[0], null).width.replace("px", ""));
	    } catch (e) {
	      var _objects$;

	      return (_objects$ = objects[0]) === null || _objects$ === void 0 ? void 0 : _objects$.offsetWidth;
	    }
	  }
	});

	let m_window = [];
	let m_document = [];
	let m_properties = {};
	let m_global = [];
	let m = []; // global
	m_global.ajax = ajax;
	m_global.ajaxPrefilter = ajaxPrefilter;
	m_document.ajaxPrefilter = ajaxPrefilter;
	m_global.ajaxSuccess = ajaxSuccess;
	m_document.ajaxSuccess = ajaxSuccess;
	m_global.extend = extend;
	m_global.now = now;
	m_global.type = type;
	m_global.support = support;
	m_global.when = when; // properties
	m_properties["jquery"] = version; // document
	m_document.ready = ready;
	m_global.ready = ready; // ready is also accessible globally (nQuery.ready)
	m.add = add;
	m.addClass = addClass;
	m.after = after;
	m.append = append;
	m.attr = attr;
	m.children = children;
	let e = eventHandler;

	m.blur = (...a) => e("blur", ...a);

	m.click = (...a) => e("click", ...a);

	m.change = (...a) => e("change", ...a);

	m.contextmenu = (...a) => e("contextmenu", ...a);
	m.css = css;
	m.data = data;

	m.dblclick = (...a) => e("dblclick", ...a);
	m.each = each;
	m.find = find;
	m.first = first;
	m.hasClass = hasClass;
	m.height = height;
	m.hide = hide;

	let hover = (...a) => e("mouseover", ...a);

	m.hover = hover;
	m.html = html;
	m.insertBefore = insertBefore;
	m.is = is;
	m_window.is = is;

	m.mousedown = (...a) => e("mousedown", ...a);

	m.mouseenter = (...a) => e("mouseenter", ...a);

	m.mouseleave = (...a) => e("mouseleave", ...a);

	m.mousemove = (...a) => e("mousemove", ...a);

	m.mouseout = (...a) => e("mouseout", ...a);

	m.mouseover = (...a) => e("mouseover", ...a);

	m.mouseup = (...a) => e("mouseup", ...a);
	m.next = next;
	m.on = on;
	m_document.on = on;
	m_window.on = on; // alias for legacy "bind"

	m.bind = on;
	m_document.bind = on;
	m_window.bind = on;
	m.one = one;
	m_document.one = one;
	m_window.one = one;
	m.off = off;
	m_document.off = off;
	m_window.off = off;
	m.outerHeight = outerHeight;
	m.outerWidth = outerWidth;
	m.parents = parents;
	m.parent = parent;
	m.position = position;
	m.prepend = prepend;
	m.prev = prev;

	let resize = (...a) => e("resize", ...a);

	m.resize = resize;
	m_window.resize = resize; // also should work on window
	m.remove = remove;
	m.removeAttr = removeAttr;
	m.removeClass = removeClass;
	m.replaceWith = replaceWith;

	let scroll = (...a) => e("scroll", ...a);

	m.scroll = scroll;
	m_window.scroll = scroll; // also should work on window
	m.show = show;
	m.siblings = siblings;
	m.text = text;
	m.toggleClass = toggleClass;
	m.trigger = trigger;
	m_window.trigger = trigger; // also should work on window

	m_document.trigger = trigger; // also should work on window
	m.width = width;

	class nQueryDocument extends nQueryObject {
	  constructor(objects) {
	    super(objects);
	  }

	}

	class nQueryWindow extends nQueryObject {
	  constructor(objects) {
	    super(objects);
	  }

	}

	for (let i in m_properties) {
	  nQueryObject.prototype[i] = m_properties[i];
	}

	for (let i in m_global) {
	  nQuery$1[i] = function (...args) {
	    return m_global[i].call(this, ...args);
	  };
	}

	for (let i in m) {
	  nQueryElement.prototype[i] = function (...args) {
	    return m[i].call(this, this, ...args);
	  };
	}

	for (let i in m_document) {
	  nQueryDocument.prototype[i] = function (...args) {
	    return m_document[i].call(this, this, ...args);
	  };
	}

	for (let i in m_window) {
	  nQueryWindow.prototype[i] = function (...args) {
	    return m_window[i].call(this, this, ...args);
	  };
	}

	function nQuery$1(object) {
	  if (typeof object === "string") {
	    if (object.match(/<.+>/g) === null) {
	      object = document.querySelectorAll(object);
	    } else {
	      object = renderHTML(object);
	    }
	  }

	  if (typeof object === "function" && typeof nQuery$1.ready === "function") {
	    nQuery$1.ready(object);
	    return;
	  }

	  if (object instanceof nQueryObject) {
	    return object;
	  } else if (object instanceof Document) {
	    return new nQueryDocument(object);
	  } else if (object instanceof Window) {
	    return new nQueryWindow(object);
	  } else {
	    return new nQueryElement(normalizeElementArray(object));
	  }
	}
	nQuery$1.__internal_r = [];
	nQuery$1.fn = {};

	nQuery$1.fn.extend = function (exts) {
	  for (let ext in exts) {
	    nQueryObject.prototype[ext] = function () {
	      exts[ext].apply(this, arguments);
	    };
	  }
	};

	document.addEventListener("DOMContentLoaded", () => {
	  nQuery$1.__internal_r.forEach(f => {
	    f();
	  });

	  nQuery$1.__ready = true;
	});

	window.nQuery = nQuery$1;
	window.nQueryObject = nQueryObject;
	window.nQueryDocument = nQueryDocument;
	window.nQueryElement = nQueryElement;
	window.nQueryWindow = nQueryWindow;
	window.nQueryPromise = nQueryPromise;

	exports.nQuery = nQuery$1;

	return exports;

}({}));
//# sourceMappingURL=nquery.js.map

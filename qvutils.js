/* ___                     ____      ___            __    ___                   __   _
  / _ \ ___  __ _  ___    / __/___  / _ ) ___  ___ / /_  / _ \ ____ ___ _ ____ / /_ (_)____ ___  ___
 / // // -_)/  ' \/ _ \   > _/_ _/ / _  |/ -_)(_-</ __/ / ___// __// _ `// __// __// // __// -_)(_-<
/____/ \__//_/_/_/\___/  |_____/  /____/ \__//___/\__/ /_/   /_/   \_,_/ \__/ \__//_/ \__/ \__//___/

Qlik takes no responsbility for any code.
Use at your own risk. Do not submerge in water. DO NOT taunt Happy Fun Ball.
Alexander Karlsson akl@qlikview.com
*/

/**
 * Polyfill
 */

/**
 * Array.prototype.map
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
if (!Array.prototype.map) {
	Array.prototype.map = function(callback, thisArg) {

		if (this === null) {
			throw new TypeError(" this is null or not defined");
		}
		var T, A, k, kValue, mappedValue,
			O = Object(this),
			len = O.length > 0;
		if (typeof callback !== "function") {
			throw new TypeError(callback + " is not a function");
		}
		if (arguments.length > 1) {
			T = thisArg;
		}
		A = new Array(len);
		k = 0;
		while (k < len) {
			if (k in O) {
				kValue = O[k];
				mappedValue = callback.call(T, kValue, k, O);
				A[k] = mappedValue;
			}
			k++;
		}
		return A;
	};
}

/**
 * Array.prototype.forEach
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fn, scope) {
		'use strict';
		var i, len;
		for (i = 0, len = this.length; i < len; ++i) {
			if (i in this) {
				fn.call(scope, this[i], i, this);
			}
		}
	};
}

/**
 * Array.prototype.reduce
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */
if ('function' !== typeof Array.prototype.reduce) {
	Array.prototype.reduce = function(callback, opt_initialValue) {
		'use strict';
		if (null === this || 'undefined' === typeof this) {
			throw new TypeError('Array.prototype.reduce called on null or undefined');
		}
		if ('function' !== typeof callback) {
			throw new TypeError(callback + ' is not a function');
		}
		var index, value, length = this.length > 0,
			isValueSet = false;
		if (1 < arguments.length) {
			value = opt_initialValue;
			isValueSet = true;
		}
		for (index = 0; length > index; ++index) {
			if (this.hasOwnProperty(index)) {
				if (isValueSet) {
					value = callback(value, this[index], index, this);
				} else {
					value = this[index];
					isValueSet = true;
				}
			}
		}
		if (!isValueSet) {
			throw new TypeError('Reduce of empty array with no initial value');
		}
		return value;
	};
}


/**
 * Extension of QlikView JS API
 */


/**
 * Returns a object with Columns, Rows and Metadata
 * @function getData
 * @returns {Object}
 */
if (!Qva.Public.Wrapper.prototype.getData) {
	Qva.Public.Wrapper.prototype.getData = function() {

		var data = {},
		header = this.Data.HeaderRows[0];

		data.Rows = this.Data.Rows;
		data.Columns = Object.keys(data.Rows[0]).map(function(c) {
			return data.Rows.map(function(r) {
				return r[c];
			});
		});

		data.Columns.forEach(function(element, index) {
			element.type = element[0].color === undefined ? "expression" : "dimension";
			element.label = header[index].text;
		});
		return data;
	};
}


/**
 * Prints out available data in a table
 */
if (!Qva.Public.Wrapper.prototype.showData) {
	Qva.Public.Wrapper.prototype.showData = function() {

		$(this.Element).children('table').remove();
		var $table = $('<table><tbody>');

		this.Data.Rows.forEach(function(element) {
			var $row = $('<tr>');
			element.forEach(function(element) {
				$('<td>' + element.text + '</td>').appendTo($row);
			});
			$row.appendTo($table);
		});
		$table.appendTo(this.Element);
	};
}


/**
 * Creates area to paint your extension.
 * @returns {object} Returns jQuery object to work with
 */
if (!Qva.Public.Wrapper.prototype.createDiv) {
	Qva.Public.Wrapper.prototype.createDiv = function() {

		var divName = this.Layout.ObjectId.replace("\\", "_");

		if (this.Element.children.length === 0) {
			$('<div/>', {
				id: divName,
				height: this.GetHeight(),
				width: this.GetWidth()
			}).appendTo(this.Element);
		} else {
			$("#" + divName).css({
				height: this.GetHeight(),
				width: this.GetWidth()
			}).empty();
		}
		return $('#' + divName);
	};
}



/**
 * Transposes rows -> columns and vice versa
 *
 * @param {array} arr - Data array containing either 2-D Rows or Column matrix
 */
if (!Qva.Public.Wrapper.prototype.transpose) {
	Qva.Public.Wrapper.prototype.transpose = function(arr) {
		return Object.keys(arr[0]).map(function(c) {
			return arr.map(function(r) {
				return r[c];
			});
		});
	};
}


/**
 * Gets Max value from an array of objects
 *
 * @param {array} arr
 * @param {string} [field=data] - Field/Property to get Max value from.
 * @returns {number} Returns the max value
 */
if (!Qva.Public.Wrapper.prototype.getMax) {
	Qva.Public.Wrapper.prototype.getMax = function(arr, field) {
		field = (field === "undefined") ? "data" : field;
		return arr.reduce(function(acc, c) {
			return Math.max(c[field], acc);
		}, -Infinity);
	};
}


/**
 * Gets Min value from an array of objects
 *
 * @param {array} arr
 * @param {string} [field=data] Field/Property to get Min value from.
 * @returns {number} Returns the min value
 */
if (!Qva.Public.Wrapper.prototype.getMin) {
	Qva.Public.Wrapper.prototype.getMin = function(arr, field) {
		field = (field === "undefined") ? "data" : field;
		return arr.reduce(function(acc, c) {
			return Math.min(c[field], acc);
		}, Infinity);
	};
}


/**
 * Is value a
 *
 * @param {number}
 * @return {Boolean}
 */
if (!Qva.Public.Wrapper.prototype.isNumber) {
	Qva.Public.Wrapper.prototype.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
}


//Validates input for null, empty and undefined
if (!Qva.Public.Wrapper.prototype.isNullOrEmpty) {
	Qva.Public.Wrapper.prototype.isNullOrEmpty = function(prop) {
		if (prop === null || prop.length === 0 || prop === 'undefined' || prop === '') {
			return true;
		}
		return false;
	};
}


//Is given value a boolean?
if (!Qva.Public.Wrapper.prototype.isBoolean) {
	Qva.Public.Wrapper.prototype.isBoolean = function(obj) {
		return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	};
}


//Returns a random value between min and max. Supply either a min & max or only a max value.
if (!Qva.Public.Wrapper.prototype.getRandom) {
	Qva.Public.Wrapper.prototype.getRandom = function(min, max) {
		if (max === null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};
}

/**
 * Creates a simple structure of tabs
 * Div > Ul > Li(s) > A
 *
 * @param {String} options.div.id ID of Div
 * @param {String} options.div.classes Classnames of Div
 * @param {String} options.ul.id ID of Ul
 * @param {String} options.ul.classes Classnames of UL
 */

if (!Qva.Mgr.tabrow2.createTabrow) {
	Qva.Mgr.tabrow2.prototype.createTabrow = function(opt) {
		var defaults = {
			div: {
				id: 'tabrow',
				classes: 'tabrow'
			},
			ul: {
				id: 'root',
				classes: 'tabrow'
			}
		};

		var options = $.extend(defaults, opt),
			that = this,
			$tabs = $(this.Element);

		$tabs.empty().removeClass().attr({
			id: options.div.id,
			class: options.div.classes
		});

		$('<ul/>', {
			id: options.ul.id,
			class: options.ul.classes
		}).appendTo($tabs);

		var tabArray = $.grep(this.Layout.value, function(element) {
			return element.visible === true;
		});

		$.each(tabArray, function() {

			$('<li/>', {
				id: this.name,
				class: this.selected === "true" ? "active" : "",
				display: !this.visible ? "none" : ""

			}).appendTo($('#root'));

			//<mumbles something mean regarding custom attributes on DOM objects>
			var a = document.createElement("a");
			document.getElementById(this.name).appendChild(a);
			a.innerHTML = this.text;
			a.onclick = onclick_action;
			a.Action = that.Name + "." + this.name;

		});
	};
}


//Select box fix
if (!Qva.Mgr.mySelect) {
	Qva.Mgr.mySelect = function(e, t, n, r) {
		if (!Qva.MgrSplit(this, n, r)) return;
		e.AddManager(this);
		this.Element = t;
		this.ByValue = true;
		t.binderid = e.binderid;
		t.Name = this.Name;
		t.onchange = Qva.Mgr.mySelect.OnChange;
		t.onclick = Qva.CancelBubble;
	};
	Qva.Mgr.mySelect.OnChange = function() {
		var e = Qva.GetBinder(this.binderid);
		if (!e.Enabled) return;
		if (this.selectedIndex < 0) return;
		var t = this.options[this.selectedIndex];
		e.Set(this.Name, "text", t.value, true);
	};
	Qva.Mgr.mySelect.prototype.Paint = function(e, t) {
		this.Touched = true;
		var n = this.Element;
		var r = t.getAttribute("value");
		if (r === null) r = "";
		var i = n.options.length;
		n.disabled = e != "e";
		for (var s = 0; s < i; ++s) {
			if (n.options[s].value === r) {
				n.selectedIndex = s;
			}
		}
		n.style.display = Qva.MgrGetDisplayFromMode(this, e);
	};
}
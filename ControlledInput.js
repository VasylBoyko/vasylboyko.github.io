definePrototypes = function(aWin)
{
	with(aWin)
	{
		(
			function(aTypes)
			{
				for(var j, i = 0; i < aTypes.length; ++i)
					for(j = 0; j < aTypes.length; ++j){
						window[aTypes[i]].prototype["is" + aTypes[j]] = window[aTypes[i]].prototype[aTypes[j].charAt(0).toLowerCase()]  = i == j;
						Object.defineProperty(window[aTypes[i]].prototype,"is" + aTypes[j],{enumerable:false});
						Object.defineProperty(window[aTypes[i]].prototype,aTypes[j].charAt(0).toLowerCase(),{enumerable:false});
				};
			}(["Array", "Date", "String", "Boolean", "Number"])
		);
		if (typeof HTMLElement != 'undefined' && !HTMLElement.prototype.insertAdjacentElement )
		{
			HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode)
			{
				switch (where)
				{
					case 'beforeBegin':
						this.parentNode.insertBefore(parsedNode, this)
						break;
					case 'afterBegin':
						this.insertBefore(parsedNode,this.firstChild);
						break;
					case 'beforeEnd':
						this.appendChild(parsedNode);
						break;
					case 'afterEnd':
						if (this.nextSibling)
							this.parentNode.insertBefore(parsedNode,this.nextSibling);
						else this.parentNode.appendChild(parsedNode);
						break;
				}
			};
			HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr)
			{
				var r = this.ownerDocument.createRange();
				r.setStartBefore(this);
				var parsedHTML = r.createContextualFragment(htmlStr);
				this.insertAdjacentElement(where,parsedHTML)
			};
			HTMLElement.prototype.insertAdjacentText = function(where, txtStr)
			{
				var parsedText = document.createTextNode(txtStr);
				this.insertAdjacentElement(where,parsedText);
			}
		};
		Function.prototype.Run = function()
		{
			return this.apply(window, arguments);
		};
		String.prototype.Trim = function()
		{
			var method = {
				L : /^\s*/g,
				R : /\s*$/g,
				A : /(^\s*)|(\s*$)/g
			};
			return function(aMethod)
			{
				return (this + "").replace(method[aMethod || "A"], "");
			};
		}();
		String.prototype.wrap = function(aHtmlToWrap, aAttributes)
		{
			var attributesList = [];
			aHtmlToWrap = aHtmlToWrap || ""
			for (var i in aAttributes)
				attributesList.push(i.replace(/^_/, "")+'="' + aAttributes[i]+'"')
			if (this.toLowerCase() == "input")
				return ["<", this, " ", attributesList.join(" "), " />"].join("")
			else
				return ["<", this, " ", attributesList.join(" "), ">", aHtmlToWrap.isArray ? aHtmlToWrap.join("") : aHtmlToWrap, "</", this, ">"].join("")
		}
		String.prototype.createElement= function()
		{
			return function(aAttributes, aChildsArray)
			{
				return new DomTag(this, aAttributes, aChildsArray);
			}
		}()
		String.prototype.Format = function()
		{
			var res = this;
			for (var i = 0; i < arguments.length ; i++)
				res = res.replace(new RegExp("\\{" + i + "\\}", "g"), "" + arguments[i] || "");
			return res;
		}
		Date.prototype.DateFormat = function()
		{
			return this.Format('MM/dd/yyyy');
		};
		Date.prototype.DateTimeFormat = function()
		{
			return this.Format('MM/dd/yyyy HH:mm');
		};
		Date.prototype.Format=function(format)
		{
			var date=this;
			if(!format)
				format="MM/dd/yyyy";
			var year=date.getFullYear();
			format=format.replace("MM",(date.getMonth()+1).PadL(2));
			if(format.indexOf("yyyy")>-1)
				format=format.replace("yyyy",year);
			else if(format.indexOf("yy")>-1)
				format=format.replace("yy",year.toString().substr(2,2));
			format=format.replace("dd",date.getDate().PadL(2));
			var hours=date.getHours();
			if(format.indexOf("tt")>-1)
				format=format.replace("tt",hours>11?"PM":"AM");
			if(format.indexOf("HH")>-1)
				format=format.replace("HH",hours.PadL(2));
			if(format.indexOf("hh")>-1){
				if(hours>12)hours-=12;
				else if(hours==0)hours=12;
				format=format.replace("hh",hours.PadL(2));
			}
			format=format.replace("mm",date.getMinutes().PadL(2));
			format=format.replace("ss",date.getSeconds().PadL(2));
			return format;
		};
		Number.prototype.DateFormat = function()
		{
			return new Date(this).DateFormat();
		};
		Number.prototype.TimeFormat = function()
		{
			var i = Math.floor(this / 60);
			return i.PadL(2) + ":" + (this % 60).PadL(2);
		};
		String.prototype.TimeFormat = function()
		{
			var i = this.split(":");
			return i[0].Trim().PadL(2) + ":" + i[1].substring(0, 2).Trim().PadL(2);
		};
		Number.prototype.Between = function(aMin, aMax)
		{
			return this >= aMin && this <= aMax;
		};
		String.prototype.PadL = function(aLength, aValue)
		{
			if (this.length >= aLength)
				return this;
			var	value = [];
			aValue = String(high().CbOS.is.Null(aValue, 0));
			aLength -= this.length;
			while (value.length < aLength)
				value.push(aValue);
			value.push(this);
			return value.join("");
		};
		Number.prototype.PadL = function(aLength, aValue)
		{
			return this.toString().PadL(aLength, aValue);
		};
		String.prototype.toArray = function(aSplit)
		{
			return this.split(high().CbOS.is.Null(aSplit, ","));
		};
		Array.prototype.toArray = function()
		{
			return this;
		};
		ConditionTypes = ["equal", "greater", "greaterequal", "less", "lessequal", "like", "likeleft", "likeright", "notempty", "notequal", "notnull", "null", "dateinperiod", "daterangecurrentday", "daterangelast7days", "daterangelast30days", "daterangelastday", "daterangelastweek", "daterangelasthalfofmonth", "daterangelastmonth", "daterangelasttwomonths", "daterangeweektodate", "daterangemonthtodate", "daterangeyeartodate", "daterangelast13weeks", "none", "asc", "desc", "containsphrase"],
		ConditionSymbols = ["=", ">", "≥", "<", "≤", "⇔", "⇒", "⇐", "✓", "≠", "✓", "x", "⇔", "◊", "◊", "◊", "◊", "◊", "◊", "◊", "◊", "◊", "◊", "◊", "◊", "", "↑", "↓", "◊"],
		Array.prototype.Contain = function(aItem)
		{
			var res = 0;
			for (var i = 0; i < this.length; ++i) 
				if(this[i] === aItem && (res = i+1))  //returned value is "1" based (not zero!!!)
					break
			return res; 
		};
		Array.prototype.Prefix = function(aPrefix)
		{
			for(var i = 0; i < this.length; ++i)
				this[i] = aPrefix + this[i];
			return this;
		};
		Array.prototype.Suffix = function(aSuffix)
		{
			for(var i = 0; i < this.length; ++i)
				this[i] += aSuffix;
			return this;
		};
		Array.prototype.GV = function(aIndex, aParam)/*get value*/
		{
			return (
					high().CbOS.is.Def(aParam = (aParam && !high().CbOS.is.Def(this[aIndex]))
					?
					this.GV(aIndex - 1, aParam)
					:
					this[aIndex]) && !aParam.isArray
				)
				?
				String(aParam)
				:
				aParam;
		};
		Array.prototype.getMaxValue = function()
		{
			var res
			if (this.length) 
			{
				res = this[0];
				for(var i = 1; i < this.length; ++i)
					if(this[i]>res) res = this[i]
			};
			return res
		}
		Array.prototype.getMinValue = function()
		{
			var res
			if (this.length) 
			{
				res = this[0];
				for(var i = 1; i < this.length; ++i)
					if(this[i]<res) res = this[i]
			};
			return res
		}
		Array.prototype.toNumber = function()
		{
			var o = [];
			for(var i = 0; i < this.length; ++i)
				o.push(high().CbOS.to.Float(this[i]));
			return o;
		};
		Boolean.prototype.GV = Number.prototype.GV = function()/*get value*/
		{
			return this.toString();
		};
		String.prototype.GV = function()/*get value*/
		{
			return String(this);
		};
		
		Number.prototype.toJSON=function()
		{
			return '"'+this+'"'
		}
		String.prototype.toJSON=function()
		{
			return '"' + this.replace(/(?=["\\])/g, '\\').replace(/\n/g,'\\n').replace(/	/,'%09') +'"'
		}
		Array.prototype.toJSON=function()
		{
			var results = [];
			for (var i=0; i<this.length; ++i) 
			{
				results.push(toJSON(this[i]));
			}
			return '["' + results.join('", "') + '"]';
		}
		Array.prototype.getDoc = function(){return document};
		aWin.protypesDefined = true;
	}
}
CbOS = {};
CbOS.OperatedInput = {
	Rules:
	{	
		Color:
		{
			RExp: /^#[0-9a-fA-F]{0,6}$/,
			DoneExp: /^#?[0-9a-fA-F]{6}$/
		},
		Phone:
		{
			RExp: /^((((\()?\d{1,2}(\))?)?(-|\.| )?)?((((\()?\d{0,3}(\))?)?(-|\.| )?\d{0,3}(-|\.| )?\d{0,4})|(((\(\d{0,3}\))|(\d{0,3}))(-|\.| )?\d{0,4})))|\d{7,12}$/,
			DoneExp: /^((((\()?\d{1,2}(\))?)?(-|\.| )?)?(((((\(\d{3}\))|(\d{3}))(-|\.| )\d{3})(-|\.| )?(\d{4}|\d{6}))|(((\(\d{3}\))|(\d{3}))(-|\.| )\d{4})))|\d{7,12}$/,
			Template: [[/^\(\d{3}$/, ") "]]
		},
		Long:
		{
			RExp: /^\d*$/,
			DoneExp: /^\d*$/
		},
		Integer:
		{
			RExp:
			[
				/^\d*$/,
				/^-?\d*$/
			],
			DoneExp: /^(\+|-)?\d{0,10}$/,
			ResultTest: function(aObj, aValue)
			{
				CbOS.OperatedInput.Rules.Integer.Init(aObj)
				if (this.DoneExp.test(aValue))
					return parseFloat(aValue, 10).Between(aObj.validationInfo.MinValue, aObj.validationInfo.MaxValue);
			},
			Init: function(aObj, aMinLength)
			{
				with (CbOS)
				{
					var obj = aObj.validationInfo
					if (!is.Def(obj.RExpIndex))
					{
						var isInt = obj.DataType == "Integer";
						var maxLength = aObj.maxLength;

						if(is.Def(obj.MinValue))
						{
							minValueLength = String(isInt ? obj.MinValue : to.Fixed(obj.MinValue, 2)).length;
						}else
						{
							minValueLength = maxLength || (isInt ? 10 : 14);
							obj.MinValue = -1 * isInt ?"9".PadL(minValueLength - 1, 9):(9.99).PadL(minValueLength - 1, 9);
						}

						if(is.Def(obj.MaxValue))
						{
							maxValueLength = String(isInt ? obj.MaxValue : to.Fixed(obj.MaxValue, 2)).length;
						}else
						{
							maxValueLength = Math.min(maxLength || 14, (isInt ? 10 : 14))
							obj.MaxValue =  (isInt ? 9 : 9.99).PadL(maxValueLength, 9) * 1;
						}
						aObj.maxLength = Math.max(maxValueLength, minValueLength);
						obj.RExpIndex = (obj.MinValue < 0) * 1;
					};
				}
			},
			RealTime: function(aObj, aValue, aMinLength)
			{
				CbOS.OperatedInput.Rules.Integer.Init(aObj, aMinLength)
				return this.Validate(aObj, aValue, this.RExp[aObj.validationInfo.RExpIndex]);
			},
			ClientVal: function(aObj, aValue)
			{
				return this.Validate(aObj, aValue, this.DoneExp);
			},
			Validate: function(aObj, aValue, aRegExp)
			{
				return this.Between(aValue, aObj.validationInfo.MinValue, aObj.validationInfo.MaxValue) && aRegExp.test(aValue)
			},
			Between: function(aValue, aMin, aMax)
			{
				aValue *= 1;
				aMin *= 1; 
				aMax *= 1;
				if (aMin >= 0 && aMax >= 0)
					return aValue >= 0 && aValue <= aMax;
				if (aMin <= 0 && aMax <= 0)
					return Math.abs(aValue) <= -aMin;
				if (aMin <= 0 && aMax >= 0)
					return Math.abs(aValue) <= Math.max(-aMin, aMax);
				return true
			}
		},
		Double:
		{
			RExp:
			[
				/^\d*(\.\d{0,2})?$/,
				/^-?\d*(\.\d{0,2})?$/
			],
			DoneExp: /^-?\d*(\.\d{0,2})?$/,
			ResultTest: function (aObj, aValue) {
				if (this.DoneExp.test(aValue))
					return parseFloat(aValue, 10).Between(aObj.validationInfo.MinValue, aObj.validationInfo.MaxValue);
			},
			Validate: function (aObj, aValue, aRegExp) {
				var k = aValue.match(/\./) ? 1 : 100;
				return (aValue == "." || CbOS.OperatedInput.Rules.Integer.Between(aValue, k * aObj.validationInfo.MinValue, k * aObj.validationInfo.MaxValue)) && aRegExp.test(aValue)
			},
			RealTime: function (aObj, aValue) {
				if (aValue == "-") {
					if (CbOS.is.Def(aObj.validationInfo.MinValue) && aObj.validationInfo.MinValue >= 0)
						return false;
					aValue = "0";
				}
				return CbOS.OperatedInput.Rules.Integer.RealTime.apply(this, [aObj, aValue, 4])
			}
		},
		Decimal:
		{
			RExp:
			[
				/^\d*(\.\d{0,2})?$/,
				/^-?\d*(\.\d{0,2})?$/
			],
			DoneExp: /^-?\d*(\.\d{0,2})?$/,
			ResultTest: function(aObj, aValue)
			{
				if (this.DoneExp.test(aValue))
					return parseFloat(aValue, 10).Between(aObj.validationInfo.MinValue, aObj.validationInfo.MaxValue);
			},
			Validate: function(aObj, aValue, aRegExp)
			{
				var k = aValue.match(/\./) ? 1 : 100;
				return (aValue == "." || CbOS.OperatedInput.Rules.Integer.Between(aValue, k * aObj.validationInfo.MinValue, k * aObj.validationInfo.MaxValue)) && aRegExp.test(aValue)
			},
			RealTime: function(aObj, aValue)
			{
				if (aValue == "-")
				{
					if (CbOS.is.Def(aObj.validationInfo.MinValue) && aObj.validationInfo.MinValue >= 0)
						return false;
					aValue = "0";
				}
				return  CbOS.OperatedInput.Rules.Integer.RealTime.apply(this, [aObj, aValue, 4])
			}
		},
		Decimal4:
		{
			RExp:
			[
				/^\d*(\.\d{0,4})?$/,
				/^-?\d*(\.\d{0,4})?$/
			],
			DoneExp: /^-?\d*(\.\d{0,4})?$/,
			ResultTest: function(aObj, aValue)
			{
				if (this.DoneExp.test(aValue))
					return parseFloat(aValue, 10).Between(aObj.validationInfo.MinValue, aObj.validationInfo.MaxValue);
			},
			Validate: function(aObj, aValue, aRegExp)
			{
				var k = aValue.match(/\./) ? 1 : 100;
				return (aValue == "." || CbOS.OperatedInput.Rules.Integer.Between(aValue, k * aObj.validationInfo.MinValue, k * aObj.validationInfo.MaxValue)) && aRegExp.test(aValue)
			},
			RealTime: function(aObj, aValue)
			{
				if (aValue == "-")
				{
					if (CbOS.is.Def(aObj.validationInfo.MinValue) && aObj.validationInfo.MinValue >= 0)
						return false;
					aValue = "0";
				}
				return  CbOS.OperatedInput.Rules.Integer.RealTime.apply(this, [aObj, aValue, 4])
			}
		},
		SSN:
		{
			RExp: /^\d{0,3}-?\d{0,2}-?\d{0,4}$/,
			DoneExp: /^(\d{3}-?\d{2}-?)?\d{4}$/,
			Template: [[/^\d{3}-\d{2}$/,"-"]]
		},
		Email:
		{
			RExp: /^[\w\s;.\[\]\-'@]*$/i
		},
		Custom:
		{
			RealTime: function(aObj, aValue)
			{
				return (aObj = aObj.validationInfo.RealTimeExp) && aObj.test(aValue);
			}
		},
		Time:
		{
			RExp: /^((((([01]?[0-9])|(2[0-3]))?)(:|(:[012345]?[0-9])){0,2})|((((0|(0?[1-9])|(1[012]))?)(((:|(:[012345]?[0-9])){0,2}) ?([ap]|[ap]m|m)?)?)))$/i,
			DoneExp:/^(((([01]?[0-9])|(2[0-3]))(:[012345]?[0-9]){1,2}))|((((0?[1-9])|(1[012]))(:[012345]?[0-9]){1,2} ?([ap]m)?))$/i,
			Template: (CbOS.is.SSFReg).test("time")?[[/^((\d{2})|[3-9])$/, ":"], [/^\d{1,2}:[\d]{1,2}$/,''], [/^.{1,2}:.{1,2}$/, ""]]:[[/^((\d{2})|[3-9])$/, ":"], [/^((0?[1-9])|(1[012]))(:[012345]?[0-9]){1,2} ?[ap]$/, "m"], [/^((0?[1-9])|(1[012]))(:[012345]?[0-9]){1,2} ?[AP]$/, "M"]]
		},
		TimeSpan:
		{
			RExp: /^((((([01]?[0-9])|(2[0-3]))?)(:|(:[012345]?[0-9])){0,2})|(((0|(0?[1-9])|(1[012]))?)(((:|(:[012345]?[0-9])){0,2}) ?)?))$/i,
			DoneExp: /^(((([01]?[0-9])|(2[0-3]))(:[012345]?[0-9]){1,2} ?)|(((0?[1-9])|(1[012]))(:[012345]?[0-9]){1,2} ?))$/i,
			Template: [[/^((\d{2})|[3-9])$/, ":"], [/^\d{1,2}:.{1,2}(:.{1,2})? *$/, ""], [/^.{1,2}:.{1,2}(:.{1,2})? *$/, ""]]
		},
		TimeSpanExt:
		{
			RExp: /^((([0-9]+)(:[012345]?[0-9]){0,2})|(([0-9]*)(((:|(:[012345]?[0-9])){0,2}) ?)?))$/i,
			DoneExp: /^((([0-9]+)(:[012345]?[0-9]){1,2} ?)|(([0-9]*)(:[012345]?[0-9]){1,2} ?))$/i,
			Template: [[/^((\d*))$/, ":"], [/^\d{1,2}:.{1,2}(:.{1,2})? *$/, ""], [/^.{1,2}:.{1,2}(:.{1,2})? *$/, ""]]
		},
		Date:
		{
			RExp: /^(0?|(0?[1-9])|(1[012]))(\/|\/((0?[1-9])|([12]?[0-9])|(3[01]))?((\/)|(\/[0-9]{0,4}))?)?$/,
			DoneExp: /^((0?[1-9])|(1[012]))\/((0?[1-9])|([12][0-9])|(3[01]))\/(([0-9]{1,2})|([0-9]{4}))$/,
			Template: [[/^((\d{2})|[2-9])$/, "/"], [/^\d{1,2}\/((\d{2})|([4-9]))$/,"/"]],
			RealTime: function(aObj, aValue)
			{
				return this.Validate(aObj, aValue, "RExp");
			},
			ClientVal: function(aObj, aValue)
			{
				return this.Validate(aObj, aValue, "DoneExp");
			},
			Validate: function(aObj, aValue, aValType)
			{
				return this[aValType].test(aValue)
			}
		},
		DateTime:
		{
			RExp: /^((((0?|(0?[1-9])|(1[012]))(\/|\/((0?[1-9])|([12]?[0-9])|(3[01]))?((\/)|(\/[0-9]{0,4}))?)?)?( ((((([01]?[0-9])|(2[0-3]))?)(:|(:[012345]?[0-9])){0,2}) ?|(((0|(0?[1-9])|(1[012]))?)(((:|(:[012345]?[0-9])){0,2}) ?([ap]|[ap]m|m)?)?)))?)|((((([01]?[0-9])|(2[0-3]))?)(:|(:[012345]?[0-9])){0,2}) ?|(((0|(0?[1-9])|(1[012]))?)(((:|(:[012345]?[0-9])){0,2}) ?([ap]|[ap]m|m)?)?)))$/i,
			DoneExp: /^((0?[1-9])|(1[012]))\/((0?[1-9])|([12][0-9])|(3[01]))\/(([0-9]{1,4}))( (((([01]?[0-9])|(2[0-3]))(:[012345]?[0-9]){1,2} ?)|(((0?[1-9])|(1[012]))(:[012345]?[0-9]){1,2} ?([ap]m)?)))?$/i,
			Template: [
				[/^((\d{2})|[2-9])$/, "/"],
				[/^\d{1,2}\/((\d{2})|([4-9]))$/,"/"],
				[/^\d{1,2}\/\d{1,2}\/\d{4}$/, " "],
				[/^\d{1,2}\/\d{1,2}\/\d{2,4} ((\d{2})|[3-9])$/, ":"],
				[/^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{1,2}(:\d{1,2})? *[ap]$/, "m"],
				[/^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{1,2}(:\d{1,2})? *[AP]$/, "M"],
				[/^\d{1,2}:\d{1,2}(:\d{1,2})? *[ap]$/, "m"],
				[/^\d{1,2}:\d{1,2}(:\d{1,2})? *[AP]$/, "M"]
			]
		}
	},
	GetCaretPos: function (aObj)
	{
		try{
		if (CbOS.is.Def(aObj.selectionStart))
			return aObj.selectionStart;
		if (CbOS.is.ie && document.selection)
		{
			var doc = CbOS.get.Doc(aObj);
			var t = false;
			var oldElem = doc.activeElement;
			if (oldElem != aObj)
			{
				aObj.focus();
				t = true;
			};
			var sel = doc.selection.createRange();
			if (aObj.type == 'textarea')
			{
				var clone = sel.duplicate();
				sel.collapse(true);
				clone.moveToElementText(aObj);
				clone.setEndPoint('EndToEnd', sel);
				if (t)
					oldElem.focus();
				return clone.text.length;
			}
			else
			{
				sel.collapse(true);
				sel.moveStart("textedit", -1);
				if (t)
					oldElem.focus();
				return sel.text.length;
			}
		};
		}catch(e){};
		return 0;
	},
	GetSelectedText: function(aObj)
	{
		if(aObj&&aObj.type!='file'){
			try{
		if(CbOS.is.Def(aObj.selectionStart))
			return aObj.value.substring(aObj.selectionStart, aObj.selectionEnd);
		if (CbOS.is.ie)
			return CbOS.get.Doc(aObj).selection.createRange().text;
			}catch(e){};
		}
		return "";
	},
	InsertString: function(aString, aChar, aPos)
	{
		return [aString.substr(0, aPos), aChar, aString.substr(aPos)].join("");
	},
	AllowDropFF: function(event)
	{
		if(event){
		var obj = event.srcElement || event.target;
		if (obj && obj.getAttribute("data-validate"))
		{
			if (!obj.getAttribute("data-rtv")) CbOS.OperatedInput.ReadValidationInfo(obj);
			if (obj.getAttribute("data-rtv")!="false")
			{
				CbOS.get.Win(obj).dragTarget={oldText: obj.value, rangeOffset: event.rangeOffset};
				CbOS.get.Win(obj).addEventListener("mouseover", CbOS.OperatedInput.DragDropComplete, true);
			}
		}
		}
	},
	DragDropComplete: function(event)
	{
		if(event){
		var obj = event.srcElement || event.target;
		CbOS.get.Win(obj).removeEventListener("mouseover", CbOS.OperatedInput.DragDropComplete, true);
		var oldText=CbOS.get.Win(obj).dragTarget.oldText,
			newText=obj.value, r,
			rangeOffset=CbOS.get.Win(obj).dragTarget.rangeOffset,
			insertedText = newText.substr(rangeOffset, newText.length - oldText.length)

		newText = [newText.substr(0, rangeOffset), insertedText, oldText.substr(rangeOffset)];
		for (var i = insertedText.length; i > 0 ; i--)
		{
			if (CbOS.OperatedInput.TestData(obj, r = newText.join("")))
			{
				obj.value = r;
				return
			};
			newText[1] = newText[1].slice(0, -1);
		};
		obj.value = oldText;
		}
	},
	DeleteString: function(aString, aPos, aDirection, aSelLen)
	{
		if (aDirection > 0 || aSelLen)
		{
			if (aSelLen == 0)
				aSelLen = 1;
			return aString.substr(0, aPos) + aString.substr(aPos + aSelLen);
		}
		return  aString.substr(0, aPos - 1) + aString.substr(aPos);
	},
	isNotChar: function(aEvent)
	{
		return (!aEvent.shiftKey) ?
			CbOS.is.In(aEvent.which, [0, 9, 16, 17, 18, 19, 20, 27, 33, 35, 34, 36, 45,144,145])
			:
			CbOS.is.In(aEvent.which, [9])
	},
	AllowType: function (aObj, aEvent)
	{
		if (!aObj.validationInfo)
			return true;
		var keyCode = aEvent.keyCode;
		if (aEvent.ctrlKey
			||
			aEvent.altKey
			||
			aEvent.metaKey
			||
			(
				aEvent.preventDefault && (aEvent.charCode == 0 || (CbOS.is.op && CbOS.OperatedInput.isNotChar(aEvent)))
				&&
				(
					!(keyCode == 46 || keyCode == 8)
					||
					(keyCode == 46 && aEvent.type == "keypress")
				)
			)
		){
			if(CbOS.is.ie&&aEvent.keyCode==32)CbOS.set.CBubble(aEvent);
			return;
		}
		if (aObj.getAttribute("data-inputreadonly"))
			CbOS.set.CBubble(aEvent);
		var newValue, curVal = aObj.value;
		if((aObj.type=="time")&&(CbOS.is.SSFReg).test("time"))return true;
		var selLen = this.GetSelectedText(aObj).length			
			if (selLen == 0 && CbOS.is.InsertKeyPressed)
				selLen = 1
			caretPos = this.GetCaretPos(aObj);
		this.SetOIParameters(aObj, "autocomplit", true);
		if ((keyCode = aEvent.charCode || keyCode) == 8)
		{
			newValue = this.DeleteString(curVal, caretPos, -1, selLen);
			this.SetOIParameters(aObj, "autocomplit", false);
		}
		else if (keyCode == 46 && aEvent.type == "keydown")
		{
			newValue = this.DeleteString(curVal, caretPos, 1, selLen);
			this.SetOIParameters(aObj, "autocomplit", false);
		}
		else
		{
			newValue = curVal;
			if (selLen > 0)
				newValue = this.DeleteString(newValue, caretPos, 1, selLen);
			newValue = this.InsertString(newValue, String.fromCharCode(keyCode), caretPos);
		};
		this.SetOIParameters(aObj, "prevValue", curVal);
		if (newValue.length != 0 && !this.TestData(aObj, newValue))
		{
			CbOS.set.CBubble(aEvent);
			return false;
		}
		else
			this.SetOIParameters(aObj, "prevValue", newValue);
		return true;
	},
	AllowInsert: function(aObj, aEvent)
	{
		var newText = aObj.value,
			oldText = aObj.OIParam.prevValue||"",
			insertedText,
			nT,t;
		if(aObj&&aObj.validationInfo&&aObj.validationInfo.AdditionalInfo&&(t=high().CbOS.to.Int(aObj.validationInfo.AdditionalInfo.lastDigits))&&aObj.value&&aObj.value.length&&!(high().CbOS.is.ff&&high().CbOS.OperatedInput.Rules.Card.time)){
			newText=aObj.value=aObj.value.substr(aObj.value.length>t?(aObj.value.length-t):0);
		}
		if(aObj && (nT=aObj.getAttribute('data-paste'))){
			nT=nT.substr(1);
			if(nT!="")
			nT=nT.length?parseFloat(nT):-1;
			newText=newText.replace(/\D/gi,'');
			if(nT!=-1 && nT!=""){
				aObj.setAttribute('maxlength',nT);
				newText=newText.substr(0,nT);
			}
			aObj.value=newText;
			aObj.removeAttribute('data-paste');
			}
		if(newText != oldText)
		{
			var newTextTrimed = newText = newText.replace(/^\s*|\s*$/g,"");
			if(CbOS.OperatedInput.TestData(aObj, newTextTrimed))
			{
				if (newTextTrimed != newText)
					aObj.value = newText = newTextTrimed;
				this.SetOIParameters(aObj, "prevValue", newText);
				return;
			}
			var dd = oldText.length - newText.length;
			for (var rangeOffset = 0; rangeOffset < oldText.length && oldText.charAt(rangeOffset) == newText.charAt(rangeOffset) ; ++rangeOffset );
			for (var j = oldText.length - 1; j >= rangeOffset && oldText.charAt(j) == newText.charAt(j - dd); --j);
			
			insertedText = newText.substr(rangeOffset, j-rangeOffset + 1 - dd)
			cbValue = insertedText;
			
			var newVal = "";

			var cbLength = Math.min(cbValue.length, (aObj.maxLength&&aObj.maxLength>-1?aObj.maxLength:CbOS.SM.set.MaxLength(aObj))), s=""
			high().CbOS.OperatedInput.SetOIParameters(aObj, 'timerID', null)
			var temlArray = aObj.validationInfo.Template || (aObj.validationInfo.mask && aObj.validationInfo.mask.Template);
			objValue = [newText.substr(0, rangeOffset), oldText.substr(j + 1)].join("");
			caretPos = rangeOffset;
			for (var i = 0; i< cbLength; ++i)
				if (this.TestData(aObj, this.InsertString(objValue, newVal + (s = cbValue.charAt(i)), caretPos)))
					newVal += s
				else
				{
					for (var j = 0; temlArray && (j < temlArray.length); j++)
						if (this.TestData(aObj, this.InsertString(objValue, newVal + (s = temlArray[j][1] + cbValue.charAt(i)), caretPos)))
						{
							newVal += s
							break
						}
				}
			if(newVal)
			{
				r = this.InsertString(objValue, newVal, caretPos)
				this.SetOIParameters(aObj, "prevValue", r);
				aObj.value = r;
				return
			}
			aObj.value = oldText;
		}
	},
	HandleBS: function(aEvent)
	{
		if(aEvent.keyCode == 13 && (aEvent.srcElement || aEvent.target).validationInfo.Multiline)
			CbOS.set.CBubble(aEvent);
		if (aEvent.keyCode == 8 || aEvent.keyCode == 46)
			this.AllowType(aEvent.srcElement || aEvent.target, aEvent);
	},
	SetOIParameters: function(aObj, aParamName, aValue)
	{
		if (!aObj.OIParam)
			aObj.OIParam = {};
		aObj.OIParam[aParamName] = aValue;
	},
	AllowPaste: function(aObj, aEvent)
	{
		var clipData = aEvent.clipboardData || CbOS.get.Win(aObj).clipboardData, cbValue,t;
		if(clipData)cbValue = clipData.getData('Text')||"";
		if(aEvent && aObj && aEvent.type=='paste' && aObj.validationInfo && (aObj.validationInfo.ValidationType=='Card'||aObj.validationInfo.ValidationType=='CreditCard')){
			if(!clipData||(CbOS.is.ie&&CbOS.is.version<9&&aObj&&aObj.getAttribute('type')=='tel')){
				aObj.setAttribute('data-paste',"D"+(aObj.getAttribute('maxlength')||""))
				aObj.removeAttribute('maxlength');			
			}else{
				cbValue=cbValue.replace(/\D/gi,'');
				}
			};
		if(aObj&&aObj.validationInfo&&aObj.validationInfo.AdditionalInfo&&(t=high().CbOS.to.Int(aObj.validationInfo.AdditionalInfo.lastDigits))&&cbValue&&cbValue.length){
			cbValue=cbValue.substr(cbValue.length>t?(cbValue.length-t):0);
		}
		if (CbOS.is.Def(cbValue))
		{
			with (CbOS.get.Win(aObj))
			{
				var oldCBValue = cbValue,
					objValue = aObj.value,
					selLen = this.GetSelectedText(aObj).length,
					caretPos = this.GetCaretPos(aObj);
				this.SetOIParameters(aObj, "OldCBValue", oldCBValue);
				if (selLen > 0)
					objValue = this.DeleteString(objValue, caretPos, 1, selLen);
				var newVal = "";
				var cbLength = Math.min(cbValue.length, aObj.maxLength || CbOS.set.MaxLength(aObj)), s=""
				high().CbOS.OperatedInput.SetOIParameters(aObj, 'timerID', null)
				var temlArray = aObj.validationInfo.Template || (aObj.validationInfo.mask && aObj.validationInfo.mask.Template);
				for (var i = 0; i< cbLength; ++i)
					if (this.TestData(aObj, this.InsertString(objValue, newVal + (s = cbValue.charAt(i)), caretPos)))
						newVal += s
					else
					{
						for (var j = 0; temlArray && (j < temlArray.length); j++)
							if (this.TestData(aObj, this.InsertString(objValue, newVal + (s = temlArray[j][1] + cbValue.charAt(i)), caretPos)))

								newVal += s
					}
				cbValue = newVal
				if (cbValue.length == 0)
				{
					aEvent.returnValue = false;
					clipData.setData('Text', oldCBValue);
				}
				else
				{
					if(clipData.setData('Text', cbValue))
						setTimeout("if (window.high() && high().CbOS) high().CbOS.OperatedInput.RestoreCBValue('" + (aObj.id || (aObj.id = high().CbOS.get.PK())) + "', window)", 10);
					else{
						newVal=objValue.substr(0,caretPos)+newVal+objValue.substr(caretPos);
						this.SetOIParameters(aObj, "prevValue", newVal);
						high().CbOS.set.CBubble(aEvent);
						aObj.value=newVal;
						high().CbOS.mask.Change(aObj);
						aEvent.returnValue = false;
						try{							
						aObj.selectionStart=caretPos;
						aObj.selectionEnd = caretPos + cbValue.length;
						}catch(e){}
						
					}
				};
			}
		}
	},
	RestoreCBValue: function(aObj, aWin)
	{
		var er, params;
		if (
			(aObj = CbOS.get.Obj(aObj, aWin))
			&&
			(params = aObj.OIParam)
		)
		{
			try{
				high().CbOS.mask.Change(aObj);
				aWin.clipboardData.clearData('Text');
				aWin.clipboardData.setData('Text', params.OldCBValue || "");
			}catch(er){}
		}
	},
	AllowDrop: function(aObj, aEvent)
	{
		if((aEvent.srcElement.tagName=="INPUT"||aEvent.srcElement.tagName=="TEXTAREA") && aEvent.dataTransfer.types.length==1 && aEvent.dataTransfer.types[0]=="text/plain")
			try{
				var cbValue = aEvent.dataTransfer.getData('Text');
				caretPos = this.GetCaretPos(aObj);
				for (var i = Math.min(cbValue.length, aObj.maxLength || CbOS.set.MaxLength(aObj)); i >= 0; --i)
					if (this.TestData(aObj, this.InsertString(aObj.value, (cbValue = cbValue.substr(0, i)), caretPos)))
						break;
				aEvent.dataTransfer.setData('Text', cbValue);
			}catch(e){};
	},
	TestData: function(aObj, aNewValue)
	{
		var prmObj = aObj.OIParam
		if (prmObj && prmObj.timerID)
			return false;
		var templChar = aObj.CbOSAddedTemplChar;
		if (templChar)
		{
			aObj.CbOSAddedTemplChar = '';
			if (aNewValue.substr(aNewValue.length - 1, 1) == templChar)
				return false;
		}
		var res = true, lRegExp = null, mask = null,
			maskId = aObj.validationInfo && (aObj.validationInfo.ValidationType || aObj.validationInfo.DataType),
			afterEventCommand = "",
			condition;
		if (aObj.validationInfo.typeConditions)
		{
			for ( var i = 0; i < aObj.validationInfo.typeConditions.length; ++i )
				if ((condition = aObj.validationInfo.typeConditions[i][0]) && typeof(condition.test) == "function")
				{
					if(condition.test(aNewValue) && !aObj.validationInfo.typeConditions[i][1].apply(aObj, [aNewValue]))
					return false;
				}else
					if(typeof(condition) == "function" && condition.apply && condition.apply(aObj, [aNewValue])&& !aObj.validationInfo.typeConditions[i][1].apply(aObj, aNewValue))
						return false;
		}
		var temlArray;
		if
		(
			(mask = this.Rules[maskId])
			&&
			!(res = mask.RealTime ? mask.RealTime(aObj, aNewValue) : (lRegExp = mask.RExp).test(aNewValue))
			&&
			prmObj && prmObj.autocomplit
			&&
			(!CbOS.is.Def(aObj.validationInfo.UseTemplate) || aObj.validationInfo.UseTemplate == "true")
			&&
			(temlArray = aObj.validationInfo.Template || mask.Template)
		)
			for (var i = 0; i < temlArray.length; ++i )
			{
				var posibleValue = aNewValue.substr(0, aNewValue.length - 1) + temlArray[i][1] + aNewValue.substr(aNewValue.length - 1, 1);
				if (res = mask.RealTime ? mask.RealTime(aObj, posibleValue) : lRegExp.test(posibleValue))
				{
					CbOS.OperatedInput.AddTemplateCharacters(CbOS.get.Doc(aObj), CbOS.get.Id(aObj) , temlArray[i][1]);
					aNewValue = posibleValue;
					break;
				};
			};
		if (!res) return false;
		var ml;
		if (
			CbOS.is.Tag(aObj, "TEXTAREA")
			&& (ml = aObj.maxLength || CbOS.set.MaxLength(aObj))
			&& !(res = (aNewValue.length <= ml))
			)
			return false;
		if (CbOS.is.Def(mask) && prmObj && prmObj.autocomplit && aObj.validationInfo.UseTemplate == "true" && mask.Template)
			for ( var temlArray = mask.Template, i = 0; i < temlArray.length; ++i)
				if (!(temlArray[i][0].test(aNewValue.substr(0, aNewValue.length - 2)) &&
					aNewValue.substr(aNewValue.length - 1, 1) == aNewValue.substr(aNewValue.length - 2, 1))&& temlArray[i][0].test(aNewValue))
				{
					afterEventCommand += "high().CbOS.OperatedInput.AddTemplateCharacters(d, '{0}', '{1}');".Format(CbOS.get.Id(aObj), temlArray[i][1]);
					aNewValue += temlArray[i][1];
					break;
				};
		if (afterEventCommand && res)
		{
			win = CbOS.get.Win(aObj);
			if (prmObj && prmObj.timerID)
				win.clearTimeout(prmObj.timerID);
			this.SetOIParameters(aObj,
				'timerID',
				win.setTimeout("if(window.high() && high().CbOS){{1}; var o = d.getElementById('{0}'); if (o) high().CbOS.OperatedInput.SetOIParameters(o, 'timerID', null);}".Format(CbOS.get.Id(aObj), afterEventCommand), 10));
		}
		return res
	},
	AddTemplateCharacters: function(aDoc, aObjId, aStr)
	{
		var obj = CbOS.get.Obj(aObjId, aDoc);
		if (obj)
		{
			if (CbOS.is.ie && aDoc.selection)
			{
				var r = obj.createTextRange();
				r.collapse(false);
				r.text = aStr;
				r = obj.createTextRange();
				r.moveStart("textedit",1);
				r.select();
			} else if (obj.selectionStart)
			{
				if (CbOS.is.ff&&CbOS.is.version<12){
					obj.OIParam.timerID = null;
					for (var i = 0; i< aStr.length; i++)
						high().EDB.TypeChar(obj, aStr.charCodeAt(i))
				}else{
					var scrollTop = obj.scrollTop, scrollLeft = obj.scrollLeft;
					if(aStr)obj.value += aStr;
					if (obj.scrollTop != scrollTop) obj.scrollTop = scrollTop;
					if (obj.scrollLeft != scrollLeft) obj.scrollLeft = scrollLeft;		
				}
			}
			obj.CbOSAddedTemplChar = aStr;
		}
	},
	ValidateValue: function(aObj, aNewValue)
	{
		if (!aObj.getAttribute("data-rtv")) CbOS.OperatedInput.ReadValidationInfo(aObj);
		var res = true;
		if (aObj.getAttribute("data-rtv") == "true")
		{
		if (CbOS.get.Win(aObj).CbOS.Validation)
			CbOS.get.Win(aObj).CbOS.Validation.ErrorHide(aObj);
		var maskId = aObj.validationInfo && (aObj.validationInfo.ValidationType || aObj.validationInfo.DataType);
			if (maskId && this.Rules[maskId])
				res = this.Rules[maskId].ResultTest(aObj, aNewValue);
		}
		return  res
	},
	timerID: null,
	InsertRem: function(aDoc, aObjId, aNewValue, aFullValue)
	{
		var s
		if (is.ie && aDoc.selection && (s = aDoc.getElementById(aObjId)) && s.OIParam && s.OIParam.autocomplit)
		{
			var r = s.createTextRange(),
				newText = aFullValue.substr(aNewValue.length);
			r.collapse(false);
			r.text = newText;
			r = s.createTextRange();
			r.moveStart("character", aFullValue.length - newText.length);
			r.select();
		};
	},
	FindStr: function(aStr, aArray)
	{
		var specialCharacters = /([\\\^\$\*\+\?\.\|\(\)\[\]\{\}])/ig;
		return function()
		{
			var r, re = new RegExp().compile("^" + aStr.replace(specialCharacters, "\\$1"), "i");
			for (var i = 0; i < aArray.length; ++i )
				if ((aStr = aArray[i][0]) && aStr.match(re))
					return i;
			return false
		}(aStr, aArray)
	},
	MaxValueSet: function(aObj, aNewMaxValue)
	{
		if (aObj)
		{
			if (!aObj.getAttribute("data-rtv"))
				CbOS.OperatedInput.ReadValidationInfo(aObj);
			if (aObj.getAttribute("data-rtv") == "true")
			{
				aObj.validationInfo.MaxValue = aNewMaxValue;
				CbOS.del(aObj.validationInfo, "RExpIndex");
				CbOS.OperatedInput.Rules.Integer.Init(aObj);
			}
		}
	},
	SetEventsHandlers: function(aObj)
	{
		with(CbOS.SM.set)
		{
			Event(aObj, "ondrop",		"high().CbOS.OperatedInput.AllowDrop(this, event)");
			Event(aObj, "onpaste",		"high().CbOS.OperatedInput.AllowPaste(this, event)");
			var newInp=CbOS.is.SSFReg.test((aObj&&aObj.type)||" ")?"high().CbOS.mask.Change(this);":"";
			if(aObj.getAttribute("data-validate")&&!aObj.getAttribute("data-validateonblur"))
			{
				CbOS._.M(aObj, "onblur", "{0}w.setTimeout('{2}high().CbOS.run.ValidateOnBlur(\"{1}\", d)',400)".Format(newInp,high().CbOS.get.Id(aObj), CbOS._.Security));
				aObj.setAttribute("data-validateonblur", "true");
			}else if(!aObj.getAttribute("data-validate")&&!aObj.getAttribute("data-validateonblur"))CbOS._.M(aObj, "onblur", newInp);
			if(!((aObj.type=="time")&&(CbOS.is.SSFReg).test("time"))){
				Event(aObj, "onkeypress",	"high().CbOS.OperatedInput.AllowType(this, event)");				
			Event(aObj, "onkeydown",	"high().CbOS.OperatedInput.HandleBS(event)");
			}else{
				aObj.value=aObj.value||(aObj.getAttribute&&aObj.getAttribute('value'));
				aObj.removeAttribute('value');
			}
			if(!(CbOS.is.ie||CbOS.is.sf||((aObj.type=="time"||aObj.type=="date"||aObj.type=="datetime")&&(CbOS.is.SSFReg).test("date time datetime"))))
				Event(aObj, "oninput",	"high().CbOS.OperatedInput.AllowInsert(this, event)");
			if(aObj.type=="text")
				high().CbOS.mask.Edit(aObj);
			}
	},
	ReadValidationInfo: function()
	{
		var dateExp = /^[09]{2}\/[09]{2}\/[09]{4}$/,
			timeExp = /^[09]{2}:[09]{2} \[AP\]M$/,
			timeSpanExp = /^[09]{2}:[09]{2}$/,
			dateTimeExp = /^[09]{2}\/[09]{2}\/[09]{4} [09]{2}:[09]{2} \[AP\]M$/,
			intExp = /^[09]+$/,
			digits = /^\\d\{\d\}$/,
			clearValue = function(){
				with(CbOS)
				{
					var isCombo = false;
					if (CbOS.is.Tag(this.parentNode,"I") && (isCombo = true))
					{
						var aObj = CbOS.get.node.Prev(this, "INPUT");
						var execute = aObj.getAttribute("data-execute");
						if (execute)
						{
							aObj.removeAttribute("data-execute");
							execute = get.Win(aObj).CbOS.set.Event(execute)
						}
						else if((execute = aObj.Exec))
							aObj.Exec = null;
						var executeOnChange = aObj.getAttribute("data-executeonchange");
						if (executeOnChange)
						{
							aObj.removeAttribute("data-executeonchange");
							executeOnChange = get.Win(aObj).CbOS.set.Event(executeOnChange);
						}
						else if((executeOnChange = aObj.ExecOnChange))
							aObj.ExecOnChange = null;
						set.Value(aObj, aObj.getAttribute("data-emptyvalue")||"", null, true);
					}
					CbOS.set.ValueWithoutExecute(this, '', null, true); 
					if (isCombo)
					{
						if(execute)
							aObj.Exec = execute;
						if(executeOnChange)
							aObj.ExecOnChange = executeOnChange
					}
					return false;
				}
			},
			onCardNumberType = [/.*/, function(aNewValue){return CbOS.OperatedInput.Rules.Card.NumberCheck(this, aNewValue)}],
			onIDType = [/.*/, function(aNewValue){return CbOS.OperatedInput.Rules.IDLic.NumberCheck(this, aNewValue)}],
			supportedTypes = ["Phone","Long", "Integer", "Currency", "Double", "Decimal", "Decimal4", "Time", "TimeSpan", "TimeSpanExt", "Date", "SSN", "Custom", "DateTime", "Color", "Email","Card","CreditCard","DriverLicense"];
		return function(aObj)
		{
			if (aObj)
			{
				if (!aObj.validationInfo)
				{
					var validationInfo = aObj.getAttribute("data-validate"), hidden = aObj,i;
					if (!validationInfo && (hidden = aObj.previousSibling) && hidden.type=="hidden" && (validationInfo =aObj.previousSibling.getAttribute("data-validate")))
					{
						if (aObj.type=="hidden")
							aObj = aObj.nextSibling
					};
					if (validationInfo && !(CbOS.is.Def(validationInfo = CbOS.get.Gpa(hidden, validationInfo)))){
						aObj.setAttribute("data-rtv", "false");
						return;
					};
				}else
				{
					validationInfo = aObj.validationInfo;
				}
				var aMask;
				if (validationInfo && (aMask = validationInfo.ValidationType || validationInfo.DataType) && CbOS.is.In(aMask, supportedTypes))
				{
					var obj = aObj.validationInfo = CbOS.set.Param(validationInfo, CbOS.create.Obj(aObj));
					if (obj.ValidationType == "Currency" || obj.DataType == "Currency")
					{
						obj.isCurrency="true"
						obj.ValidationType = obj.DataType = aMask = "Decimal"
					}
					else if (aMask == "Custom")
					{
						var conditions;
						if (obj.typeConditions)
						{
							var setEv = CbOS.get.Win(aObj).CbOS.set.Event;
							obj.typeConditions = setEv("return " + obj.typeConditions).apply();
							for (var i = 0; i < obj.typeConditions.length; ++i)
								if (typeof(obj.typeConditions[i][1]) != "function")
									obj.typeConditions[i][1] = setEv(obj.typeConditions[i][1]);
						}
						if (validationInfo.RealTimeExp)
							obj.RealTimeExp = new RegExp(validationInfo.RealTimeExp);
						else
						{
							if (digits.test(validationInfo.RegExp))
							{
								digits.exec(validationInfo.RegExp)
								obj.RealTimeExp = new RegExp( "^\\d{0," + RegExp.$1 + "}$");
							}
							else if (!obj.typeConditions)
							{
								aObj.setAttribute("data-RTV", "false");
								return false;
							}
						}
					}else if (aMask == "Card" || aMask=="CreditCard")
					{
						if (!CbOS.OperatedInput.Rules.Card) 
							CbOS.OperatedInput.Rules.Card = new CardValidator();
						if(aObj.getAttribute('type')=='text'){
							CbOS.OperatedInput.Rules.Card.RExp=/(.|\s)+/;
							CbOS.OperatedInput.Rules.Card.DoneExp=/(.|\s)+/;
						}
						if (!obj.typeConditions)
							obj.typeConditions=[];
						obj.typeConditions.push(onCardNumberType)
					}else if (aMask == "DriverLicense")
					{
						if (!CbOS.OperatedInput.Rules.IDLic) 
							CbOS.OperatedInput.Rules.IDLic = new IDLic();
						if (!obj.typeConditions)
							obj.typeConditions=[];
						obj.typeConditions.push('return true', onIDType)
					};
					obj.mask = this.Rules[aMask];
					if(aMask=="Card"&&aObj.getAttribute("data-new-type-card")=='true')
						with(obj.mask){
							DoneExp=/^\d{14,19}$/;
							RExp=/^%{0,1}\d{0,19}$/;
							for(i in CardTypes)
								if(CardTypes[i][0]=="CardOneCard")
									CardTypes[i][2]=[19];
						};
					aObj.setAttribute("data-rtv", "true");
					if (!obj.UseTemplate)
						obj.UseTemplate = "true";
					this.SetOIParameters(aObj, "prevValue", aObj.value);
					CbOS.OperatedInput.SetEventsHandlers(aObj);
					if(!aObj.getAttribute('pattern')&&CbOS.OperatedInput.Rules[validationInfo.ValidationType]&&(CbOS.OperatedInput.Rules[validationInfo.ValidationType].DoneExp||(CbOS.OperatedInput.Rules[validationInfo.ValidationType].mask&&CbOS.OperatedInput.Rules[validationInfo.ValidationType].mask.DoneExp)))
						aObj.setAttribute('pattern', (CbOS.OperatedInput.Rules[validationInfo.ValidationType].DoneExp||CbOS.OperatedInput.Rules[validationInfo.ValidationType].mask.DoneExp).toString().replace(/(^\/|\/$)/gi,""));
					return obj;
				};
				aObj.setAttribute("data-rtv", "false");
			}
		}
	}()
};

CbOS.Messages.Validaton = {
	Get: function(aName)
	{
		aName = CbOS.Messages.Validaton[aName];
		for (var i = 1; i < arguments.length; ++i)
			aName = aName.replace(new RegExp("\\{" + i + "\\}", "g"),arguments[i])
		return aName
	},
	Custom: 'Wrong Value.',
	Email: 'Wrong email address.',
	CheckNumber: 'Wrong check number. Check number should consists only from digits <br/>and have maximum 16 digits long.',
	Phone: 'Wrong phone number. Phone/fax should be exactly 7 or 10 (with area code and 1 or 2 digits of prefix) digits long.<br/>Ex.: 11 (232) 344-8984 or 11-232-344-8984 or (11) 232.234.1234 or 234.1234',
	SSN: 'Wrong social security number. Social security number should be exactly 4 or 9 digits long. Ex.: 1111 or 111-22-3333.',
	Color: 'Wrong color value. Color number should consists of # and 6 hexadecimal digits.',
	URL: 'Invalid URL.',
	Password: 'Incorrect password. Password must have at least 6 characters and contain at least 1 number or punctuation character.',
	Integer: 'Must be Integer.',
	Long: 'Must be Long.',
	Double: 'Must be Double.',
	Decimal: 'Must be Decimal.',
	Currency: 'Must be Currency.',
	Date: 'Must be Date.',
	Time: 'Must be Time.',
	TimeOverflow: 'Wrong duration. Must be hh:mm:ss ',
	DateTime: 'Must be Date and Time.',
	DateAndOrTime: 'Must be Date and/or Time.',
	BusinessObject: 'Item does not exist.',
	Mandatory: 'Field is mandatory.',
	CheckBoxListMandatory: 'Checkbox list should have at least one checked item',
	Unique: 'Must be unique.',
	Between: 'Value should be between {1} and {2}.',
	Less: 'Value should be equal or less than {1}.',
	Greater: 'Value should be equal or greater than {1}.'
}





export var $global = {};

export function $q(p, o)
{
	if(o)
	{
		return o.querySelector(p);
	}
	return document.querySelector(p);
}

export function $qa(p, o)
{
	if(o)
	{
		return o.querySelectorAll(p);
	}
	return document.querySelectorAll(p);
	
}

export function $attr(dom, a, s)
{
	if(s)
	{
		dom.setAttribute(a, s)
	}
	else
	{
		return dom.getAttribute(a);
	}
}
export function $hasAttr(dom, a)
{
	return dom.hasAttribute(a);
}
export function $removeattr(dom, a)
{
	dom.removeAttribute(a);
}

export var $msgc = {
	_funcs: {},
	subscribe: function(name, func)
	{
		if(!this._funcs[name]) this._funcs[name] = []
		this._funcs[name].push(func);
	},
	send: function(name, ...args)
	{
		if(this._funcs[name])
		{
			for(var i = 0; i < this._funcs[name].length; i++)
			{
				this._funcs[name][i].apply(null, args);
			}
		}
	},
	unsubscribe: function(name, func)
	{
		var index = this._funcs[name].indexOf(func);
		if(index > -1) this._funcs[name].splice(index, 1);
	}
};


export function $fastpath(obj, p, v)
{
	if(!obj) return;
	if(v===undefined)
	{
		return p.split(".").reduce((o, pp)=>
		{
			if(!o) return o;
			return o[pp];
		}, obj);
		
	}
	
	var at = p.split(".");
	if(at.length == 1)
	{
		obj[p] = v;
	}
	else
	{
		var atend = at.pop();
		at.reduce((o,p)=>
		{
			if(!o[p]) o[p] = {};
			return o[p];
		}, obj)[atend] = v;
	}
}
//mouseenter, mouseleave, mousemove, mouseover, mouseout, mouseup, mousewheel, touchcancel
//todo leave to get error to know where to start. 
//body offline
/*
function _makeMouseEvents(e)
{
	var x = [];
	var y = [];
	
	if(e.which)
	{
		x.push(e.offsetX);
		y.push(e.offsetY);
		
	}
	else
	{
		//must be touch events. 
		for(var i = 0; i < e.touches.length; i++)
		{
			x.push(evt.touches[i].offsetX);
			y.push(evt.touches[i].offsetY);
		}
	}
	//e.x = x;
	//e.y = y;
	e.tie= {};
	e.tie.x = x;
	e.tie.y = y;
	
}*/

var __comps = {};


export function $comp(name, o)
{
	if(o)
	{
		document.head.insertAdjacentHTML("beforeend", `<style>${o.css}</style>`);
		__comps[name] = o;
		
	}
	else
	{
		return __comps[name];
	}
};
///////////////////////////////////////////////////////////////////////////////////////////
//parse section

var uniquename = 0;

		function remakeDom(dom, ato)
		{
			var temp = document.createElement("div");
			
			if(ato.html)
			{
				temp.innerHTML = ato.html.trim().replaceAll("$uniquename", "____name" + uniquename);
			}
			else
			{
				temp.innerHTML = o.html.trim().replaceAll("$uniquename", "____name" + uniquename);
			}
			uniquename++;
			var tempdom = temp.firstChild;//content;//.firstChild;
			return tempdom;
		}

		function finishRemakeDom(dom, tempdom)
		{
			var tieinner;
			if($hasAttr(tempdom, "tieinner"))
			{
				tieinner = tempdom;
			}
			else
			{
				tieinner = $q("*[tieinner]", tempdom);
			}
			
			if(tieinner)
			{
				while(dom.childNodes.length >0)
				{
					var v1 = dom.childNodes[0];
					tieinner.appendChild(v1);
				}
			}
			dom.replaceWith(tempdom);
		}

		function getTieOrTieEvents(tie)
		{
			var a = tie.split(",");
			
			for(var i = 0; i < a.length; i++)
			{
				a[i] = a[i].split(":").map((a)=> a.trim());
			}
			return a;
		}
		
		function getDomTie(dom)
		{
			var attri = $attr(dom, "tie");
			if(!attri) return undefined;
			return getTieOrTieEvents(attri);
		}
		
		function getDomTieEvents(dom)
		{
			var attri= $attr(dom, "tieevents"); 
			if(!attri) return undefined;
			return getTieOrTieEvents(attri);
		}
		
		function getDomTieClass(dom)
		{
			var attri = $attr(dom, "tieclass");
			if(!attri) return undefined;
			return attri.trim();
		}
		
		function getDomTieDom(dom)
		{
			var attri = $attr(dom, "tiedom");
			if(!attri) return undefined;
			return attri.trim();
		}
		function getDomTieRadio(dom)
		{
			var attri = $attr(dom, "tieradio");
			if(!attri) return undefined;
			return attri.trim();
		}
		
		function createTieOrTieEvents_BackerFieldsAndTracker(dom, o, tiea)
		{
			if(tiea)
			{
				
				for(var i = 0; i < tiea.length; i++)
				{
					//check for value on path
					if($fastpath(o, tiea[i][0]))
					{
						//has value.
						$fastpath(o, "backerfields." + tiea[i][0], $fastpath(o, tiea[i][0]));
					}
					else
					{
						//create property as undefined.
						$fastpath(o, tiea[i][0], null);
						//create.
						$fastpath(o, "backerfields." + tiea[i][0], null);
					}
					
					if(!$fastpath(o, "tracker." + tiea[i][0]))
					{
						$fastpath(o, "tracker." + tiea[i][0], []);
						
						
					}
					
					if(!$fastpath(o, "domtracker." + tiea[i][0]))
					{
						//create domtracker
						$fastpath(o, "domtracker." + tiea[i][0], []);
					}
					
					$fastpath(o, "domtracker." + tiea[i][0]).push(dom);
				}
				
			}
		}
		
		function createTieClassTieRadio_BackerAndTracker(dom, o, tieclass)
		{
			
			if(tieclass)
			{
				
				if($fastpath(o, tieclass))
				{
					$fastpath(o, "backerfields." + tieclass, $fastpath(o, tieclass));
				}
				else
				{
					//create vlue
					$fastpath(o, tieclass, null);
					$fastpath(o, "backerfields." + tieclass, null);
				}
			}
			if(!$fastpath(o, "tracker." + tieclass))
			{
				$fastpath(o, "tracker." + tieclass, []);
				//create domtracker
				$fastpath(o, "domtracker." + tieclass, []);
			}
			$fastpath(o, "domtracker." + tieclass).push(dom);
		}
		
		function setDomTieClass(dom, o, tiep, v)
		{
			var domtracker = $fastpath(o.domtracker, tiep);
			for(var i= 0; i < domtracker.length; i++)
			{
				setBackerOtherMultiDom(domtracker[i], o, tiep, v);
			}
		}
		
		function setDomTieRadio(dom, o, tiep, v)
		{
			var domtracker = $fastpath(o.domtracker, tiep);
			for(var i= 0; i < domtracker.length; i++)
			{
				setBackerOtherMultiDom(domtracker[i], o, tiep, v);
			}
		}
		
		function _createGetSetTieClass(dom, o, tiep, ato, atend)
		{
			
			Object.defineProperty(ato, tiep, 
			{
				get: function()
				{
					return $fastpath(o.backerfields, tiep);
				},
				set: function(v)
				{
					$fastpath(o.backerfields, tiep, v);
					/*var tracker = $fastpath(o.tracker, tiep);
					for(var i = 0; i < tracker.length; i++)
					{
						//tracker[i](v);
					}*/
					setDomTieClass(dom, o, tiep, v);
				}
			});

		}
		
		function createGetSetTieClass(dom, o, tiep)
		{
			var at = o;
			var att = tiep.split(".");
			var atend = att.pop();
			
			var ato = att.reduce((oo,p)=>
			{
				if(!oo[p]) oo[p] = {};
				return oo[p];
			}, o);
			_createGetSetTieClass(dom, o, tiep, ato, atend);
		}
		
		function _createGetSetTieRadio(dom, o, tiep, ato, atend)
		{
			Object.defineProperty(ato, tiep, 
			{
				get: function()
				{
					return $fastpath(o.backerfields, tiep);
				},
				set: function(v)
				{
					
					$fastpath(o.backerfields, tiep, v);
					/*var tracker = $fastpath(o.tracker, tiep);
					for(var i = 0; i < tracker.length; i++)
					{
						//tracker[i](v);
					}*/
					setDomTieRadio(dom, o, tiep, v);
				}
			});

		}
		
		function createGetSetTieRadio(dom, o, tiep)
		{
			var at = o;
			var att = tiep.split(".");
			var atend = att.pop();
			
			var ato = att.reduce((oo,p)=>
			{
				if(!oo[p]) oo[p] = {};
				return oo[p];
			}, o);
			_createGetSetTieRadio(dom, o, tiep, ato, atend);
		}
		
		function setDomTieBi(dom, o, tiep, v)
		{
			var domtracker = $fastpath(o.domtracker, tiep[0]);
			for(var i = 0; i < domtracker.length; i++)
			{
				//$fastpath(domtracker[i], tiep[1], v);
				setBackerOtherMultiDom(domtracker[i], o, tiep[0], v);
			}
		}
		
		function _createGetSetBi(dom, o, tiep, ato, atend)
		{
			
			Object.defineProperty(ato, tiep[0], 
			{
				get: function()
				{
					return $fastpath(o.backerfields, tiep[0]);
				},
				set: function(v)
				{
					$fastpath(o.backerfields, tiep[0], v);
					/*var tracker = $fastpath(o.tracker, tiep[0]);
					for(var i = 0; i < tracker.length; i++)
					{
						//tracker[i](v);
					}*/
					setDomTieBi(dom, o, tiep, v);
				}
			});

		}
		
		function createTieGetSetBi(dom, o, tiep)
		{
			var at = o;
			var att = tiep[0].split(".");
			var atend = att.pop();
			
			var ato = att.reduce((oo,p)=>
			{
				if(!oo[p]) oo[p] = {};
				return oo[p];
			}, o);
			_createGetSetBi(dom, o, tiep, ato, atend);
		}
		
		function setDomRadioFromBacker(dom, o, tiep)
		{
			var v = $fastpath(o.backerfields, tiep);
			if(v)
			{
				var name = $attr(dom, "name");
				var domtracker = $fastpath(o.domtracker, tiep);
				for(var i= 0; i < domtracker.length; i++)
				{
					var atv = $attr(domtracker[i], "value");
					if(atv == v)
					{
						domtracker[i].checked = true;
						break;
					}
				}
				
				
			}
			
		}
		function setDomClassFromBacker(dom, o, tiep)
		{
			$attr(dom, "class", $fastpath(o.backerfields, tiep));
			
		}
		function setDomFromBackerBi(dom, o, tiep)
		{
			$fastpath(dom, tiep[1], $fastpath(o.backerfields, tiep[0]));
		}
		
		
		function setBackerOtherMultiDom(dom, o, tiep1, v)
		{
			//var domtrack = $fastpath(o.domtracker, tiep);
			
			var tiea = getDomTie(dom);
			var tiec = getDomTieClass(dom);
			var tieradio = getDomTieRadio(dom);
			if(tiec && tiec == tiep1)
			{
				$attr(dom, "class", v);
			}
			if(tieradio && tieradio == tiep1)
			{
				var atv = $attr(dom, "value");
				if(atv == v)
				{
					dom.checked = true;
				}
			}
			if(tiea)
			{
				for(var i = 0; i < tiea.length; i++)
				{
					var atp = tiea[i];
					if(atp[0] == tiep1)
					{
						$fastpath(dom, atp[1], v);
					}
				}
				//$fastpath(dom1, tiep[1], v);
			}
			
		}
		
		function setBackerOtherDomFromValueDoTrackerClass(dom, o, tiep, v, tag)
		{
			$fastpath(o.backerfields, tiep, v);
			
			var track = $fastpath(o.tracker, tiep);
			for(var i = 0; i < track.length; i++)
			{
				track[i](v);
			}
			/*
			$qa(`*[${tag}*="${tiep[0]}:${tiep[1]}"`).forEach((dom1)=>
			{
				if(dom1 != dom)
				{
					$attr(dom1, "class", v);
				}
				
			});*/
			
			var domtrack = $fastpath(o.domtracker, tiep);
			for(var i = 0; i < domtrack.length; i++)
			{
				var dom1 = domtrack[i];
				if(dom1 != dom)
				{
					//$fastpath(dom1, tiep[1], v);
					setBackerOtherMultiDom(dom1, o, tiep, v);
				}
			}
			
			
		}
		
		function setBackerOtherDomFromValueDoTrackerRadio(dom, o, tiep, v, tag)
		{
			var checked = dom.checked;
			if(!checked) return;
			
			$fastpath(o.backerfields, tiep, v);
			
			var track = $fastpath(o.tracker, tiep);
			for(var i = 0; i < track.length; i++)
			{
				track[i](v);
			}
			
			var domtrack = $fastpath(o.domtracker, tiep);
			for(var i = 0; i < domtrack.length; i++)
			{
				var dom1 = domtrack[i];
				if(dom1 != dom)
				{
					//$fastpath(dom1, tiep[1], v);
					setBackerOtherMultiDom(dom1, o, tiep, v);
				}
			}
			
			
		}
		
		function setBackerOtherDomFromValueDoTrackerBi(dom, o, tiep, v, tag)
		{
			$fastpath(o.backerfields, tiep[0], v);
			
			var track = $fastpath(o.tracker, tiep[0]);
			for(var i = 0; i < track.length; i++)
			{
				track[i](v);
			}
			
			var domtrack = $fastpath(o.domtracker, tiep[0]);
	
			for(var i = 0; i < domtrack.length; i++)
			{
				var dom1 = domtrack[i];
				if(dom1 != dom)
				{
					//$fastpath(dom1, tiep[1], v);
					setBackerOtherMultiDom(dom1, o, tiep[0], v);
				}
			}
			
		}
		
		function createTrackEvent(dom, o, event)
		{
			
			dom[event] = function(e)
			{
				var at = this;
				var o = at.parentobj;
				
				var tiea = getDomTie(at);
				var tieradio = getDomTieRadio(at);
				var tiec = getDomTieClass(at);
				//var tiee = getDomTieEvents(at);
				
				if(tiea)
				{
					for(var i = 0; i < tiea.length; i++)
					{
						var v1 = $fastpath(at,  tiea[i][1]);
						var v2 = $fastpath(o, tiea[i][0]);
						if(v1 != v2)
						{
							setBackerOtherDomFromValueDoTrackerBi(dom, o, tiea[i], v1, "tie");
						}
					}
				}
				if(tieradio)
				{
					var v1 = $attr(at, "value");
					var v2 = $fastpath(o, tieradio);
					if(v1 != v2)
					{
						$fastpath(o, tieradio, v1);
						setBackerOtherDomFromValueDoTrackerRadio(dom, o, tieradio, v1, "tieradio");
					}
				}
				{
					var v1 = $attr(at, "class");
					if(v1)
					{
						v1 = v1.trim();
						var v2 = $fastpath(o, tiec);
						if(v1 != v2)
						{
							$fastpath(o, tiec, v1);
							setBackerOtherDomFromValueDoTrackerClass(dom, o, tiec, v1, "tieclass");
						}
					}
					
				}
				
			};
		}
		
		function createTrackEvents(dom, o)
		{
			var trackevents = $attr(dom, "trackevents");
			if(trackevents)
			{
				trackevents=trackevents.split(",").map((t)=>t.trim());
				if(!dom.parentobj) dom.parentobj = o;
				for(var i = 0; i < trackevents.length; i++)
				{
					createTrackEvent(dom, o, trackevents[i]);
				}
			}
		}
		
		
function parseSingleDom(dom, o)
{
		var tiea = getDomTie(dom);
		var tiec = getDomTieClass(dom);
		var tiee = getDomTieEvents(dom);
		var tied = getDomTieDom(dom);
		var tieradio = getDomTieRadio(dom);
		
		createTieOrTieEvents_BackerFieldsAndTracker(dom, o, tiea);
		createTieOrTieEvents_BackerFieldsAndTracker(dom, o, tiee);
		createTieClassTieRadio_BackerAndTracker(dom, o,tiec);
		createTieClassTieRadio_BackerAndTracker(dom, o,tieradio);
		if(tiea)
		{
			for(var i = 0; i < tiea.length; i++)
			{
				createTieGetSetBi(dom, o, tiea[i]);
			}
		}
		if(tiee)
		{
			for(var i = 0; i < tiee.length; i++)
			{
				createTieGetSetBi(dom, o, tiee[i]);
			}
		}
		if(tiec)
		{
			createGetSetTieClass(dom, o,tiec);
		}
		
		if(tieradio)
		{
			createGetSetTieRadio(dom, o, tieradio);
		}
		
		if(tiea)
		{
			for(var i = 0; i < tiea.length; i++)
			{
				setDomFromBackerBi(dom, o, tiea[i]);
			}
		}
		if(tiee)
		{
			for(var i = 0; i < tiee.length; i++)
			{
				setDomFromBackerBi(dom, o, tiee[i]);
			}
		}
		if(tiec)
		{
			setDomClassFromBacker(dom, o,tiec);
		}
		if(tieradio)
		{
			setDomRadioFromBacker(dom, o, tieradio);
		}
		
		createTrackEvents(dom, o);
		
		o[tied] = dom;
		
		return o;
}

function setCompObjBi(o, oo, tiep)
{
	for(var i  = 0; i < tiep.length; i++)
	{
		$fastpath(oo.attributes, tiep[i][1], $fastpath(o, tiep[i][0]));
	}
}

function setCompAttributes(pdom, o, listo)
{
	var tietype = $attr(pdom, "tietype");
	if(!tietype)
	{
		return undefined;
	}
	
	var tiea = getDomTie(pdom);
	var tiec = getDomTieClass(pdom);
	var tiee = getDomTieEvents(pdom);
	
	var attributes = {};
	
	for(var i = 0; i < pdom.attributes.length; i++)
	{
		var attri = pdom.attributes[i].name;
		var value = pdom.attributes[i].value;
		if(!(attri == "tie" || attri == "tieevents" || attri == "tietype" || attri=="tieobj"))
		{
			attributes[attri] = value;
		}
	}//end for*/
	
	
	return {
		attributes:attributes,
		tiea: tiea,
		tiee: tiee
	};
	
}

function finalSetCompAttributes(o, oo, attri)
{
	if(!attri) return;
	var attributes = attri.attributes;
	var tiea = attri.tiea;
	var tiee = attri.tiee;
	if(!oo.attributes) oo.attributes = attributes;
	else
	{
		for(var i in attributes)
		{
			oo.attributes[i]= attributes[i];
		}
	}
	if(tiea) setCompObjBi(o, oo, tiea);
	if(tiee) setCompObjBi(o, oo, tiee);
	
}

function finalSetTopCompAttributes(o, attri)
{
	if(!attri) return;
	var attributes = attri.attributes;
	var tiea = attri.tiea;
	var tiee = attri.tiee;
	if(!o.attributes) o.attributes = attributes;
	else
	{
		for(var i in attributes)
		{
			o.attributes[i]= attributes[i];
		}
	}
	//ignore since top start of doc.
	//if(tiea) setCompObjBi(o, oo, tiea);
	//if(tiee) setCompObjBi(o, oo, tiee);
	
}
function removedDom(records)
{
	
	for(var a = 0; a < records.length; a++)
	{
		var nodes = records[a].removedNodes;
		for(var b = 0; b < nodes.length; b++)
		{
			if(nodes[b].parentobj)
			{
				var node = nodes[b];
				if(!node.parentobj.___donotremove)
				{	
					if(node.parentobj.destruct) node.parentobj.destruct();
				}
			}
		}
	}
}

var observerconfig = 
{
	childList:true, 
	subtree:true, 
	removed: true
};

var ob = new MutationObserver(removedDom);
ob.observe($q("body"), observerconfig);



function parseDom(pdom, listo, parento)
{
	var tietype = $attr(pdom, "tietype");
	if(!tietype)
	{
		return undefined;
	}
	var ato= $comp(tietype);
	var o = ato();
	o.___donotremove = true;
	listo.push(o);
	if(o.beforeinit) o.beforeinit();
	
	var dom = remakeDom(pdom, ato);
	dom.parentobj = o;
	o.parentdom = dom;
	
	//dom.addEventListener("DOMNodeRemoved", removedDom, false);
	
	if(pdom.nodeName == "COMP")
	{
		var attri = setCompAttributes(pdom, o, listo);
		if(parento)
		{
			finalSetCompAttributes(parento, o, attri);
		}
		else
		{
			finalSetTopCompAttributes(o, attri);
		}
		
		
	}
	
	
	//
	if(dom.nodeName != "COMP" && ($attr(dom, "tie")||
	$attr(dom, "tieclass")||$attr(dom, "tieevents")
	||$attr(dom, "trackevents") || $attr(dom, "tiedom") || $attr(dom, "tieradio")    ))
	{
		parseSingleDom(dom, o);
	}
	$qa("*[tie], *[tieclass], *[tieevents], *[trackevents], *[tiedom], *[tieradio]", dom).forEach((dom1)=>
	{
		if(dom.nodeName == "COMP") return;
		parseSingleDom(dom1, o);
		
	});
	
	
	$qa("comp", dom).forEach((dom1)=>
	{
		dom1.attri = setCompAttributes(dom1, o, listo);
	});
	finishRemakeDom(pdom, dom);
	$qa("comp", dom).forEach((dom1)=>
	{
		var oo = parseDom(dom1, listo, o);
		finalSetCompAttributes(o, oo, dom1.attri);
	});
	if(pdom.nodeName == "COMP")
	{
		var tieobj=$attr(pdom, "tieobj");
		if(tieobj)
		{
			tieobj= tieobj.trim();
			$fastpath(parento, tieobj, o.attributes);
			
		}
		
	}
	return o;
}
export var $init = [];
export function $doc()
{
	var listo = [];
	$qa("doc").forEach((dom)=>
	{
		var o = parseDom(dom, listo);
		
	});
	for(var i = 0; i < listo.length; i++)
	{
		if(listo[i].init)listo[i].init();
	}
	for(var i = 0; i < listo.length; i++)
	{
		
		if(listo[i].afterinit)listo[i].afterinit();
	}
	for(var i = 0; i < listo.length; i++)
	{
		delete listo[i].___donotremove;
	}
	
	for(var i= 0; i < $init.length; i++) $init[i]();
	
}
export function $parse(dom)
{
	var listo = [];
	$qa("comp", dom).forEach((dom1)=>
	{
		var o = parseDom(dom1, listo);
	});
	
	for(var i = 0; i < listo.length; i++)
	{
		if(listo[i].init)listo[i].init();
	}
	for(var i = 0; i < listo.length; i++)
	{
		
		if(listo[i].afterinit)listo[i].afterinit();
	}
	for(var i = 0; i < listo.length; i++)
	{
		delete listo[i].___donotremove;
	}
}

export function $appendComp(o, dom, compstr)
{
	/*
	var compstr = "<comp ";
	for(var i in obj)
	{
		compstr = compstr + i + " = \"" + obj[i] +"\" ";
	}
	compstr += "></comp>";
	* */
	
	//dom.innerHTML = compstr;
	
	
	var listo= [];
	var temp = document.createElement("div");
	temp.innerHTML = compstr;
	
	$qa("comp", temp).forEach((dom1)=>
	{
		var oo = parseDom(dom1, listo, o);
	});
	
	
	
	for(var i = 0; i < listo.length; i++)
	{
		if(listo[i].init)listo[i].init();
	}
	for(var i = 0; i < listo.length; i++)
	{
		
		if(listo[i].afterinit)listo[i].afterinit();
	}
	
	while(temp.childNodes.length >0)
	{
		var v1 = temp.childNodes[0];
		dom.appendChild(v1);
	}
	
	for(var i = 0; i < listo.length; i++)
	{
		delete listo[i].___donotremove;
	}
}

export function $removeComp(o)
{
	o.parentdom.remove();
}

export var $ = {
	global: $global,
	q: $q,
	qa: $qa,
	attr: $attr,
	hasAttr: $hasAttr,
	removeattr: $removeattr,
	msgc: $msgc,
	comp: $comp,
	doc: $doc,
	parse: $parse,
	appendComp: $appendComp,
	removeComp: $removeComp,
	init: $init
};

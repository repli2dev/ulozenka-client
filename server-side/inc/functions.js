/**
 * Ulozenka.cz simple interface for any website
 * -------------------------------------------
 * @author Jan Drábek
 * @version 1.0
 * @licence BSD licence
 * 
 * History
 * -------------------------------------------
 * 1.0. Released first version as is
 * 
 * Documentation
 * -------------------------------------------
 * Architecture:
 *   1. Independent JavaScript which takes care about showing the data into webpage
 *   2. PHP part which downloads XML data from ulozenka.cz and transform them in JS along with minified independent JavaScript
 *   
 * TODOs
 * -------------------------------------------
 *  - Better styling and templating
 *  - Cross browser tests
 */

function UAGetElementByClass(selector) {
	var elems = document.getElementsByTagName('*'), i;
	for (i in elems) {
		if((" " + elems[i].className + " ").indexOf(" " + selector + " ") > -1) {
			return elems[i];
		}
	}
	return null;
}
function UAAppendOption(select, text, value) {
	var option = document.createElement('option');
	option.text = text;
	option.value = value;
	try {
		select.add(option, null); // standards compliant; doesn't work in IE
	} catch(ex) {
		select.add(option); // IE only
	}
}
function UAGetBranchById(id) {
	var branches = UAData["pobocky"];
	for(var i = 0; i < branches.length; i++) {
		if(branches[i]["aktiv"] != 1) continue;
		if(branches[i]["id"] == id) return branches[i];
	}
	return null;
}

function UAGetSelect(prompt) {
	branches = UAData["pobocky"];
	// Create select
	var select = document.createElement('select');
	select.name = "branch-list";
	if(prompt == null) {
		UAAppendOption(select,"--- Vyberte pobočku pro doručení ---", '');
	} else
	if(prompt != "") {
		UAAppendOption(select,prompt, '');
	}
	for(var i = 0; i < branches.length; i++) {
		if(branches[i]["aktiv"] != 1) continue;
		UAAppendOption(select, branches[i]["nazev"], branches[i]["id"]);
	}
	return select;
}

function UARenderSimpleSelect(chooser, currentId, prompt, readOnly) {
	select = UAGetSelect(prompt);
	select.onchange = function() {
		var index = UASelectCurrentValue("branch-list");
		if(index == '') {
			var old = document.getElementById('branch-detail')
			if(old != null) {
				old.parentNode.removeChild(old);
			}
			return;
		}
		var detail = document.createElement('div');
		detail.id = "branch-detail";
		var item = UAGetBranchById(index);
		detail.innerHTML = "<a href=\"" + item["odkaz"] + "\" target=\"_blank\">informace o pobočce &raquo;</a>";		
		old = document.getElementById('branch-detail')
		if(old != null) {
			old.parentNode.removeChild(old);
		}
		chooser.appendChild(detail);
	}
	chooser.innerHTML = "";
	chooser.appendChild(select);
	if(currentId != null && currentId != "") {
		UASelectSetCurrentValue(select, currentId);
	}
	UAFireOnchange(select);	
	if(readOnly == "true") {
		UASetReadOnly(select);
	}
}
function UARenderError() {
    chooser.innerHTML = "Načtení se nezdařilo, kontaktujte nás, prosím.";
}
function UASelectCurrentValue(name) {
	var current = document.getElementsByName(name)[0];
	return current.options[current.selectedIndex].value;
}
function UASelectSetCurrentValue(select, value) {
	for (var i=0; i<select.length; i++){
		if (select.options[i].value == value) {
			select.selectedIndex = i;
		}
	}
	UAFireOnchange(select);
}
function UASetReadOnly(select) {
	select.disabled = true;
}
function UAFireOnchange(obj) {
	if ("fireEvent" in obj)
		obj.fireEvent("onchange");
	else {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);
		obj.dispatchEvent(evt);
	}
}
function UARenderSelectWithInfo(chooser, currentId, prompt, readOnly) {
	select = UAGetSelect(prompt);
	select.onchange = function() {
		var index = UASelectCurrentValue("branch-list");
		if(index == '') {
			var old = document.getElementById('branch-detail')
			if(old != null) {
				old.parentNode.removeChild(old);
			}
			return;
		}
		var item = UAGetBranchById(index);
		var detail = document.createElement('div');
		detail.id = "branch-detail";
		detail.innerHTML = "<div style=\"margin-top: 10px;\"><div style=\"width:310px; float: left;\"><img src=\"http://www.ulozenka.cz/images/pobocky/"+item["obrazek"]+"\" alt=\""+item["nazev"]+" umístění\"></div><div style=\"width: 300px; float: left;\"><p style=\"margin-top: 0px;\"><strong style=\"font-size: 1.3em;\">" + item["nazev"] + "</strong></p>"
		+ "<address>" + item["ulice"] + "<br />" + item["psc"] + " " + item["obec"] + "</address>"
		+ "<p>Telefon: " + item["telefon"] + "<br />"
		+ "E-mail: <a href=\"mailto:" + item["email"] + "\">" + item["email"] + "</a></p>"
		+ "<p><strong>Otevírací doba</strong><br />"
		+ item["provoz"] + "</p>"
		+ "</div><div style=\"width: 300px; float: left;\">" +item["mapa"] + "</div>"

		+ "<hr style=\"clear:both; height:1px; margin: -1px 0 0 0; padding:0; border:none; visibility: hidden;\" /></div>";
		old = document.getElementById('branch-detail')
		if(old != null) {
			old.parentNode.removeChild(old);
		}
		chooser.appendChild(detail);
	}
	chooser.innerHTML = "";
	chooser.appendChild(select);
	if(currentId != null && currentId != "") {
		UASelectSetCurrentValue(select, currentId);
	}
	UAFireOnchange(select);
	if(readOnly == "true") {
		UASetReadOnly(select);
	}
}
function UACreateGUI() {
    chooser = UAGetElementByClass('branch-chooser');
    // Check for errors
    if(UAData['code'] == 500) {
        UARenderError(chooser);
    }
	branches = UAData['pobocky'];
	type = chooser.getAttribute('data-type');
	currentId = chooser.getAttribute('data-current-id');
	prompt = chooser.getAttribute('data-prompt');
	readOnly = chooser.getAttribute('data-read-only');
	if(type == null || type == "" ||type == 1) {
		UARenderSimpleSelect(chooser, currentId, prompt, readOnly);
	} else {
		UARenderSelectWithInfo(chooser, currentId, prompt, readOnly);
	}
}

UACreateGUI();
"use strict";
//-----------------------------------------------------------------------------------
// welcome message 
//-----------------------------------------------------------------------------------
// TODO: obfuscate coursekey and audience?
// TODO: create nav page for me
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.03';
	const page = {};
  const settings = {};
  
  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbweqaXGa76eKl_Tuj84UgUyc21K8ty9TE7Je1ffN9D2ZO4CpWxE/exec',
    apikey: 'MV_welcomeAPI'
  };
        
	//---------------------------------------
	// get things going
	//----------------------------------------
  async function init() {
		page.body = document.getElementsByTagName('body')[0];

    _renderStandardElements();
		
		_setNotice('initializing...');
		if (_initializeSettings()) {
			_setNotice('loading...');

      var requestParams = {coursekey: settings.coursekey};
      var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'courseinfo', requestParams, _reportError);

      if (requestResult.success) {
        _setNotice('');
        var layoutdata = requestResult.data
        _renderPage(settings.audience, layoutdata.config[settings.audience], layoutdata.standards, layoutdata.passwordlink);
      }
		}
  }
  
	//-------------------------------------------------------------------------------------
	// query params:
	//-------------------------------------------------------------------------------------
	function _initializeSettings() {
    var result = false;

    var urlParams = new URLSearchParams(window.location.search);
		settings.coursekey = urlParams.has('coursekey') ? urlParams.get('coursekey') : null;
		settings.audience = urlParams.has('audience') ? urlParams.get('audience') : null;

    if (settings.coursekey != null && settings.coursekey != '' 
        && settings.audience != null && settings.audience != '') {
			result = true;

    } else {   
      _setNotice('failed to initialize: invalid parameters');
    }
    
    return result;
  }
	
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderStandardElements() {
    page.notice = CreateElement._createDiv('notice', 'notice');
    page.body.appendChild(page.notice);
  }
  
  function _renderPage(audience, config, standards, passwordlink) {
    page.body.appendChild(CreateElement._createDiv(null, 'container-fluid', config.container));
    _renderSection('innercontainer', config.innercontainer, standards);
    if (audience == 'mentor') _renderPasswordSection('passwords', standards.Assessment.Assess_passwords, passwordlink);
    
    for (var key in config) {
      if (key != 'container' && key != 'innercontainer') _renderSection(key, config[key], standards);
    }
    
    _changeLinkTargets();
    _eliminateEmptyListItems();
  } 
    
  function _renderSection(sectionId, sectionMarkdown, standards) {
    var elem = document.getElementById(sectionId);
    var markdown = _replaceTemplateVariables(sectionMarkdown, standards);
    elem.innerHTML = _convertMarkdownToHTML(markdown);
  }
  
  function _renderPasswordSection(sectionId, passwordStandard, passwordLink) {
    var section = document.getElementById(sectionId);

    if (passwordStandard != '' && passwordStandard != 'There are no exam passwords')   {
      section.appendChild(CreateElement._createLink(null, null,  'course passwords', passwordLink));
    }
  }
  
  function _replaceTemplateVariables(str, standards) {
    var standardsVars = str.match(/\[\[([^\[^\]^.]*)\.([^\[^\]]*)\]\]/g);  // [[major.minor]]
    if (standardsVars) {
      for (var i = 0; i < standardsVars.length; i++) {
        var templateVar = standardsVars[i];
        var key = templateVar.slice(2,-2);
        var major = key.match(/([^\.]*)\./)[1];
        var minor = key.match(/\.([^\.]*)/)[1];
        var standardVal = standards[major][minor];
        if (standardVal.toLowerCase() == 'n/a') standardVal = '';
        str = str.replace(templateVar, standardVal);
      }
    }
    
    return str; 
  }

  function _changeLinkTargets() {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('mailto:') != 0) {
        links[i].target = '_blank';
      }
    }
  }
  
  function _eliminateEmptyListItems() {
    var toElim = [];
    var listItems = document.getElementsByTagName('li');
    for (var i = 0; i < listItems.length; i++) {
      if (listItems[i].innerHTML == '') {
        toElim.push(listItems[i]);
      }
    }
    
    for (var i = 0; i < toElim.length; i++) {
      toElim[i].parentNode.removeChild(toElim[i]);
    }
  }
  
	//------------------------------------------------------------------
	// process MarkDown
	//------------------------------------------------------------------  
 function _convertMarkdownToHTML(text) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(text);
    var result = writer.render(parsed);

    return result;
  }
  
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  

	//---------------------------------------
	// utility functions
	//----------------------------------------
	function _setNotice (label) {
		page.notice.innerHTML = label;

		if (label == '') {
			page.notice.style.display = 'none'; 
		} else {
			page.notice.style.display = 'block';
		}
	}
  
  function _reportError(src, err) {
    _setNotice('Error in ' + src + ': ' + err.name + ' "' + err.message + '"');
  }

	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();

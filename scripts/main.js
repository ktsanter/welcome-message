"use strict";
//-----------------------------------------------------------------------------------
// welcome message 
//-----------------------------------------------------------------------------------
// TODO: obfuscate coursekey ?
// TODO: get mentor link to password tool
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
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
        settings.layoutdata = requestResult.data;
        _renderPage();
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
  
  function _renderPage() {
    var audience = settings.audience;
    var config = settings.layoutdata.config[audience];
  
    page.body.appendChild(CreateElement._createDiv(null, 'container-fluid', config.container));
    _renderSection('innercontainer', config.innercontainer);
    if (settings.audience == 'mentor') _renderPasswordSection('passwords');
    
    for (var key in config) {
      if (key != 'container' && key != 'innercontainer') _renderSection(key, config[key]);
    }
    
    _changeLinkTargets();
  } 
    
  function _renderSection(sectionId, sectionMarkdown) {
    var elem = document.getElementById(sectionId);
    var markdown = _replaceTemplateVariables(sectionMarkdown);
    elem.innerHTML = _convertMarkdownToHTML(markdown);
  }
  
  function _renderPasswordSection(sectionId) {
    if (settings.audience != 'mentor') return;
    
    var section = document.getElementById(sectionId);
    var standard = settings.layoutdata.standards.Assessment.Assess_passwords;

    if (standard != '' && standard != 'There are no exam passwords')   {
      var href = ''; // figure this out - get from sheet?
      section.appendChild(CreateElement._createLink(null, null,  'TODO: link to new pwd tool', href));
    }
  }
  
  function _replaceTemplateVariables(str) {
    var standardsVars = str.match(/\[\[([^\[^\]^.]*)\.([^\[^\]]*)\]\]/g);  // [[xxxx.yyyy]]
    if (standardsVars) {
      for (var i = 0; i < standardsVars.length; i++) {
        var templateVar = standardsVars[i];
        var key = templateVar.slice(2,-2);
        var major = key.match(/([^\.]*)\./)[1];
        var minor = key.match(/\.([^\.]*)/)[1];
        var standardVal = settings.layoutdata.standards[major][minor];
        str = str.replace(templateVar, standardVal);
      }
    }
    
    var termlongVars = str.match(/\[\[termlong\]\]/g);
    if (termlongVars) {
      for (var i = 0; i < termlongVars.length; i++) {
        str = str.replace(termlongVars[i], '??????');
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
  
	//------------------------------------------------------------------
	// process MarkDown
	//------------------------------------------------------------------  
 function _convertMarkdownToHTML(text) {
    var highlightspan = "<span style=\"background-color: #FFFF00\">";
    var highlightendspan = '</span>';

    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();

    var parsed = reader.parse(text);  // tree now available for walking

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

"use strict";
//-----------------------------------------------------------------------------------
// welcome message landing page
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
        var layoutdata = requestResult.data;
        _renderWelcomeMessage(settings.audience, layoutdata.config[settings.audience], layoutdata.standards, layoutdata.passwordlink);
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

  function _renderWelcomeMessage(audience, config, standards, passwordLink) {
    var message = new WelcomeMessage;
    message.setParams(audience, config, standards, passwordLink);
    message.renderPage(page.body);
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

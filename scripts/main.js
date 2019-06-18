"use strict";
//-----------------------------------------------------------------------------------
// welcome message landing page
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.06';
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
		
    var expectedQueryParams = [{key: 'coursekey', required: true}, {key: 'audience', required: true}];
		if (_initializeSettings(expectedQueryParams)) {
			page.notice.setNotice('loading...', true);

      var requestParams = {coursekey: settings.coursekey};
      var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'courseinfo', requestParams, page.notice);

      if (requestResult.success) {
        page.notice.setNotice('');
        var layoutdata = requestResult.data;
        _renderWelcomeMessage(settings.audience, layoutdata.config[settings.audience], layoutdata.standards, layoutdata.passwordlink);
      } else {
        page.notice.setNotice('load failed');
      }
		}
  }
  
	//-------------------------------------------------------------------------------------
	// query params:
	//-------------------------------------------------------------------------------------
	function _initializeSettings(expectedParams) {
    var result = false;

    var urlParams = new URLSearchParams(window.location.search);
    for (var i = 0; i < expectedParams.length; i++) {
      var key = expectedParams[i].key;
      settings[key] = urlParams.has(key) ? urlParams.get(key) : null;
    }

    var receivedRequiredParams = true;
    for (var i = 0; i < expectedParams.length && receivedRequiredParams; i++) {
      var key = expectedParams[i].key;
      if (expectedParams[i].required) receivedRequiredParams = (settings[key] != null);
    }
    
    if (receivedRequiredParams) {
			result = true;

    } else {   
      page.notice.setNotice('failed to initialize: invalid parameters');
    }
    
    return result;
  }
	
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderStandardElements() {
    page.notice = new StandardNotice(page.body, page.body);
  }

  function _renderWelcomeMessage(audience, config, standards, passwordLink) {
    var message = new WelcomeMessage;
    message.setParams(audience, config, standards, passwordLink);
    message.renderMessage(page.body);
  }
  
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();

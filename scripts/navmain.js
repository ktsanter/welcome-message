"use strict";
//-----------------------------------------------------------------------------------
// navigation front-end for welcome messages
//-----------------------------------------------------------------------------------
// TODO: obfuscate coursekey and audience?
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'Course welcome messages';
	const page = {};
  const settings = {};
  
  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbweqaXGa76eKl_Tuj84UgUyc21K8ty9TE7Je1ffN9D2ZO4CpWxE/exec',
    apikey: 'MV_welcomeAPI'
  };
  
  const NO_COURSE = 'no-course';
        
	//---------------------------------------
	// get things going
	//----------------------------------------
  function init() {
		page.body = document.getElementsByTagName('body')[0];
    page.error = CreateElement._createDiv('errorMessageWelcomeNav', null, '')
    page.body.appendChild(page.error);
    page.message = new WelcomeMessage();
		
		if (_initializeSettings()) {
      _renderControlbar();
		}
  }
  
	//-------------------------------------------------------------------------------------
	// query params:
	//-------------------------------------------------------------------------------------
	function _initializeSettings() {
    var result = true;
    
    return result;
  }
	
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  async function _renderControlbar() {
    var container = CreateElement._createDiv(null, 'controlbar');
    page.body.appendChild(container);
    container.appendChild(CreateElement._createDiv(null, 'controlbar-title', appname));
    _renderNotice(container);
    
    var courseList = await _getCourseList();
    if (courseList) {      
      var elemSelect = CreateElement._createSelect(null, 'controlbar-select', e => _handleChangeSelect(e));
      container.appendChild(elemSelect);
      elemSelect.appendChild(CreateElement._createOption(null, null, NO_COURSE, 'select a course...'));
      for (var i = 0; i < courseList.length; i++) {
        elemSelect.appendChild(CreateElement._createOption(null, null, courseList[i].coursekey, courseList[i].coursename));
      }
      
      container.appendChild(CreateElement._createRadio(null, 'controlbar-audience', 'audience', 'student', 'student', true, _handleAudienceClick));
      container.appendChild(CreateElement._createRadio(null, 'controlbar-audience', 'audience', 'mentor', 'mentor', false, _handleAudienceClick));
      settings.audience = 'student';
      
      //id, classList, title, handler, dblclickhandler
      container.appendChild(CreateElement._createIcon('iconLink', 'fa-lg fas fa-link', 'create link to welcome message page', _handleLinkClick));
      container.appendChild(CreateElement._createIcon('iconMessage', 'fa-lg fas fa-comment-alt', 'create formatted message suitable for email', _handleMessageClick));
      
      page.messagecontainer = CreateElement._createDiv(null, 'message-container');
      page.body.appendChild(page.messagecontainer);
    }
  }

  function _renderNotice(attachTo) {
    var container = CreateElement._createDiv(null, 'controlbar-notice');
    attachTo.appendChild(container);
    
    page.notice = CreateElement._createDiv('notice', 'notice');
    container.appendChild(page.notice);
    page.spinner = CreateElement._createIcon('spinner', 'fa fa-spinner fa-pulse fa-3x fa-fw"');
    container.appendChild(page.spinner);
  }
  
  async function _getCourseList() {
    var courseList = null;

    _setNotice('loading course list', true);    
    var requestParams = {};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'courselist', requestParams, _reportError);

    if (requestResult.success) {
      _setNotice('');
      courseList = requestResult.data.sort(function(a, b) {
        return a.coursename.localeCompare(b.coursename);
      });
    }

    return courseList;
  }
  
  async function _loadAndRenderWelcomeMessage() {
    var coursekey = settings.coursekey;
    var audience = settings.audience;
    page.message.removeMessage();

    if (!coursekey || !audience || coursekey == NO_COURSE) return;

    _setNotice('loading course info', true);
        
    var requestParams = {coursekey: coursekey};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'courseinfo', requestParams, _reportError);

    if (requestResult.success) {
      _setNotice('');
      var data = requestResult.data;
      _renderWelcomeMessage(audience, data.config[audience], data.standards, data.passwordlink);
    }
  }
  
  function _renderWelcomeMessage(audience, config, standards, passwordlink) {
    page.message.setParams(audience, config, standards, passwordlink);
    page.message.renderMessage(page.messagecontainer);
  }  
	  
  function _makeURLForWelcomePage(coursekey, audience) {
    var origin = window.location.origin;
    var splitpath = window.location.pathname.split('/')
    var justpath = '';
    for (var i = 0; i < splitpath.length - 1; i++) {
      if (i != 0) justpath += '/';
      justpath += splitpath[i];
    }
    var filename = 'index2.html';
    var queryParams = '?coursekey=' + coursekey + '&audience=' + audience;

    
    return origin + justpath + '/' + filename + queryParams;
  }
  
  function _copyMentorLinkText() {
    var coursekey = settings.coursekey;
    var audience = settings.audience;
    if (!coursekey || !audience || coursekey == NO_COURSE) return;

    
    _copyToClipboard(_makeURLForWelcomePage(coursekey, audience));
    _setNotice('copied link');
  }
  
  function _copyMentorMessageText() {
    var coursekey = settings.coursekey;
    var audience = settings.audience;
    if (!coursekey || !audience || coursekey == NO_COURSE) return;
    
    var url = _makeURLForWelcomePage(coursekey, audience);
    var msg = '<em>test</em> this is <a href="' + url + '" target="blank">' + 'the link' + '</a>' + ' and more stuff!';
    _copyRenderedToClipboard(msg);
    _setNotice('copied message');
  }
  
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  function _handleChangeSelect(e) {
    settings.coursekey = e.target[e.target.selectedIndex].value
    _setNotice('');
    _loadAndRenderWelcomeMessage();
  }

  function _handleAudienceClick(e) {
    settings.audience = e.target.value;
    _setNotice('');
    _loadAndRenderWelcomeMessage();
  }
  
  function _handleLinkClick() {
    _copyMentorLinkText();
  }
  
  function _handleMessageClick() {
    _copyMentorMessageText();
  }
  
  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  function _copyToClipboard(txt) {
    if (!page._clipboard) page._clipboard = new ClipboardCopy();

    page._clipboard._copyToClipboard(txt);
	}	

  function _copyRenderedToClipboard(txt) {
    var container, elemButton, elemTarget;
    
    if (!page._renderedclipboardcontainer) {
      container = CreateElement._createDiv('renderedCopyContainer', 'renderedcopy');
      elemButton = CreateElement._createButton('btnCopyRendered', null, 'hide me');
      elemTarget = CreateElement._createDiv('divCopyRenderedTarget', null);
      elemButton.setAttribute('data-clipboard-target', '#' + elemTarget.id);
      console.log(Clipboard);
      var junk = new Clipboard(elemButton); 
      
      container.appendChild(elemButton);
      container.appendChild(elemTarget);
      page._renderedclipboardcontainer = container;
      page.body.appendChild(page._renderedclipboardcontainer);
      
    } else {
      container = document.getElementById('renderedCopyContainer');
      elemButton = document.getElementById('btnCopyRendered');
      elemTarget = document.getElementById('divCopyRenderedTarget');
    }
    
    container.style.display = 'block';
    elemTarget.innerHTML = txt;
    elemButton.click();
    container.style.display = 'none';
  }
  
	//---------------------------------------
	// utility functions
	//----------------------------------------
	function _setNotice (msg, showSpinner) {
		page.notice.innerHTML = msg;

		if (msg == '') {
			page.notice.style.display = 'none'; 
      page.spinner.style.display = 'none'
      
		} else {
			page.notice.style.display = 'inline-block';
      if (showSpinner) {
        page.spinner.style.display = 'inline-block';
      } else {
        page.spinner.style.display = 'none'
      }
		}
	}
  
	function _reportError (src, err) {
		page.error.innerHTML = 'Error in ' + src + ': ' + err.name + ' "' + err.message + '"';
		page.error.style.display = 'inline-block';
	}

	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
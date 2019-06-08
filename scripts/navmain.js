"use strict";
//-----------------------------------------------------------------------------------
// navigation front-end for welcome messages
//-----------------------------------------------------------------------------------
// TODO: obfuscate coursekey and audience?
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.04';
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
    page.error = CreateElement.createDiv('errorMessageWelcomeNav', null, '')
    page.body.appendChild(page.error);
    page.message = new WelcomeMessage();
		
		if (_initializeSettings()) {
      //_renderControlbar();
      _renderPage();
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
  async function _renderPage() {
    await _renderControlbar();
       
    page.messagecontainer = CreateElement.createDiv(null, 'message-container');
    page.body.appendChild(page.messagecontainer);
  }
  
  async function _renderControlbar() {
    var container = CreateElement.createDiv(null, 'controlbar');
    page.body.appendChild(container);
    container.appendChild(CreateElement.createDiv(null, 'controlbar-title', appname));
    _renderNotice(container);
    
    var resultdata = await _getNavInfo();
    if (resultdata && resultdata.courselist) {
      var courseList = resultdata.courselist;
      settings.message = {student: resultdata.studentmessage, mentor: resultdata.mentormessage};
      
      var elemSelect = CreateElement.createSelect('courseSelect', 'controlbar-select', e => _handleChangeSelect(e));
      container.appendChild(elemSelect);
      elemSelect.appendChild(CreateElement.createOption(null, null, NO_COURSE, 'select a course...'));
      for (var i = 0; i < courseList.length; i++) {
        elemSelect.appendChild(CreateElement.createOption(null, null, courseList[i].coursekey, courseList[i].coursename));
      }
      
      container.appendChild(CreateElement.createRadio(null, 'controlbar-audience', 'audience', 'student', 'student', true, _handleAudienceClick));
      container.appendChild(CreateElement.createRadio(null, 'controlbar-audience', 'audience', 'mentor', 'mentor', false, _handleAudienceClick));
      settings.audience = 'student';
      
      container.appendChild(CreateElement.createIcon('iconLink', 'fa-lg fas fa-link', 'create link to welcome message page', _handleLinkClick));
      container.appendChild(CreateElement.createIcon('iconMessage', 'fa-lg fas fa-comment-alt', 'create formatted message suitable for email', _handleMessageClick));
    }
  }

  function _renderNotice(attachTo) {
    var container = CreateElement.createDiv(null, 'controlbar-notice');
    attachTo.appendChild(container);
    
    page.notice = CreateElement.createDiv('notice', 'notice');
    container.appendChild(page.notice);
    page.spinner = CreateElement.createIcon('spinner', 'fa fa-spinner fa-pulse fa-3x fa-fw"');
    container.appendChild(page.spinner);
  }
  
  async function _getNavInfo() {
    var resultdata = null;

    _setNotice('loading course list', true);    
    var requestParams = {};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'navinfo', requestParams, _reportError);

    if (requestResult.success) {
      _setNotice('');
      resultdata = requestResult.data;
      resultdata.courselist = resultdata.courselist.sort(function(a, b) {
        return a.coursename.localeCompare(b.coursename);
      });
    }

    return resultdata;
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
  
  function _copyLinkText() {
    var coursekey = settings.coursekey;
    var audience = settings.audience;
    if (!coursekey || !audience || coursekey == NO_COURSE) return;

    _copyToClipboard(_makeURLForWelcomePage(coursekey, audience));
    _setNotice('copied link');
  }
  
  function _copyMessageText() {
    var coursekey = settings.coursekey;
    var audience = settings.audience;
    if (!coursekey || !audience || coursekey == NO_COURSE) return;
    
    var elemSelect = document.getElementById('courseSelect');
    var coursename = elemSelect[elemSelect.selectedIndex].text;
    var url = _makeURLForWelcomePage(coursekey, audience);
    
    var linkspan = '<span style="color: white; background-color: #115e6e; border: 1px solid white; border-radius: 6px; padding: 4px 4px;">';
    linkspan += '<a href="' + url + '" target="_blank" style="color:white; background-color: #115e6e; text-decoration: underline;">welcome letter</a>';
    linkspan += '</span>';
    
    var passwordlinkspan = '-   This course has no passwords.\n';
    if (page.message.hasPasswords()) {
      var passwordlinkspan = '<span style="color: white; background-color: #115e6e; border: 1px solid white; border-radius: 6px; padding: 4px 4px;">';
      passwordlinkspan += '<a href="' + page.message._passwordlink + '" target="_blank" style="color:white; background-color: #115e6e; text-decoration: underline;">course passwords</a>';
      passwordlinkspan += '</span>';
      passwordlinkspan = '- The exams in this course are password-protected and you can find them here: ' + passwordlinkspan + '.  Please keep them secure - when exam time comes please enter them for your students.\n';
    }
    
    var msg = settings.message[audience];
    msg = _replaceTemplateVariables(msg, {
      COURSE: '***' + coursename + '***', 
      LINK: linkspan, 
      PASSWORDS: passwordlinkspan
    });
    msg = MarkdownToHTML.convert(msg);
    
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
    _copyLinkText();
  }
  
  function _handleMessageClick() {
    _copyMessageText();
  }
  
  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  function _copyToClipboard(txt) {
    if (!page._clipboard) page._clipboard = new ClipboardCopy(page.body, 'plain');

    page._clipboard.copyToClipboard(txt);
	}	

  function _copyRenderedToClipboard(txt) {
    if (!page._renderedclipboard) page._renderedclipboard = new ClipboardCopy(page.body, 'rendered');

    page._renderedclipboard.copyRenderedToClipboard(txt);
	}	
  
	//------------------------------------------------------------------
	// process MarkDown
	//------------------------------------------------------------------    
  function _replaceTemplateVariables(str, replacements) {
    var templateVars = str.match(/\[\[[^\[^\]]*\]\]/g);  // should match [[xxxxx]]
    if (templateVars) {
      for (var i = 0; i < templateVars.length; i++) {
        var templateVar = templateVars[i];
        var key = templateVar.slice(2, -2);
        
        var replaceVal = '[???]';
        if (key == 'FIRST_NAME') replaceVal = '[FIRST_NAME]';
        else replaceVal = replacements[key];

        str = str.replace(templateVar, replaceVal);
      }
    }
    
    return str; 
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

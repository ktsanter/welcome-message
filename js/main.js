//
// TODO: move courseInfo to Google Sheet and deploy web API
// TODO: get course list from Web API
//
const app = function () {
	const PAGE_TITLE = 'Welcome letter message generator'
	const PAGE_VERSION = 'v0.1';
		
	const API_BASE = 'https://script.google.com/macros/s/AKfycbwuO-prQVmE_8HetNfg67dqK4Jie7eetp_8j4Bo5HcHGASf_5GN/exec';
	const API_KEY = 'MVwelcomemessageAPI';
	
	const NO_COURSE = 'NO_COURSE';
	const TEMPLATEVAR_CLASS = 'wl-has-template-item';
	
	const USE_DEFAULT = 'USE_DEFAULT';
	
	const page = {};
	const settings = {
		"include": "./include/",
	};

	const layoutElementId = {
		"student": {
			"main": "contents",
			"contact": "msg_student_contact",
			"generalinfo": "msg_generalinfo",
			"welcome": "msg_welcome",
			"expectations1": "msg_exp1",
			"expectations2": "msg_exp2",
			"keypoints": "msg_student_keypoints"
		},
		"mentor": {
			"main": "contents",
			"contact": "msg_mentor_contact",
			"generalinfo": "msg_mentor_generalinfo",
			"welcome": "msg_mentor_welcome",
			"resources": "msg_mentor_resources",
			"expectations": "msg_mentor_exp1",
			"response": "msg_mentor_response",
			"specialpop": "msg_mentor_specialpop",
			"keypoints": "msg_mentor_keypoints"
		}
	};
	
	const defaultIncludeFile = {
		"student": {
			"main": "msg_student_main.html",
			"contact": "msg_student_contact.html",
			"generalinfo": "msg_student_generalinfo.html",
			"welcome": "msg_student_welcome.html",
			"expectations1": "msg_student_exp1.html",
			"expectations2": "msg_student_exp2.html",
			"keypoints": ""
		},
		"mentor": {
			"main": "msg_mentor_main.html",
			"contact": "msg_mentor_contact.html",
			"generalinfo": "msg_mentor_generalinfo.html",
			"welcome": "msg_mentor_welcome.html",
			"resources": "msg_mentor_resources.html",
			"expectations": "msg_mentor_exp1.html",
			"response": "msg_mentor_response.html",
			"specialpop": "msg_mentor_specialpop.html",
			"keypoints": ""
		}
	};
	
	//---------------------------------------
	// get things going
	//----------------------------------------
	function init () {
		page.header = document.getElementById('header');
		page.header.toolname = document.getElementById('toolname');
		page.header.courses = document.getElementById('courses');
		page.header.controls = document.getElementById('controls');

		page.notice = document.getElementById('notice');
		page.notice.classList.add('wl-notice');
		
		page.standards = document.getElementById('contents');
		
		if (!_initializeSettings()) {
			_setNotice('Failed to generate welcome letter - invalid parameters');
		} else {
			if (settings.navmode) {
				_getCourseList(_initHeader);
			} else {
				_generateWelcomeLetter();
			}
		}
	}
	
	//-------------------------------------------------------------------------------------
	// query params:
	//    navmode: display course dropdown and student/mentor options (other params ignored if navmode)
	//    coursekey:  short name for course (required unless navmode)
	//    student: make student welcome (either this or mentor is required unless navmode)
	//    mentor: make mentor welcome (either this or student is required unless navmode)
	//-------------------------------------------------------------------------------------
	function _initializeSettings() {
		var result = false;

		var params = {};
		
		settings.navmode = false;
		settings.coursekey = NO_COURSE;
		settings.studentmentor = 'student';
			
		var urlParams = new URLSearchParams(window.location.search);
		params.navmode = urlParams.has('navmode');
		params.coursekey = urlParams.has('coursekey') ? urlParams.get('coursekey') : null;
		params.student = urlParams.has('student');
		params.mentor = urlParams.has('mentor');

		settings.navmode = params.navmode;
		if (params.navmode) {
			result = true;
			
		} else if (params.coursekey != null && (params.student || params.mentor)) {
			settings.coursekey = params.coursekey;
			if (params.student) {
				settings.studentmentor = 'student';
			} else {
				settings.studentmentor = 'mentor';
			}
			result = true;
		} 
		
		return result;
	}
	
	//------------------------------------------------------------------------------
	// initialization of output page including optional controls section for navmode
	//------------------------------------------------------------------------------
	function _initHeader() {
		page.header.classList.add('wl-header');
				
		page.header.toolname.innerHTML = PAGE_TITLE;
		
		var elemCourseSelect = _createCourseSelect();
		
		var elemStudentMentor = _createStudentMentorChoice();
			
		page.header.courses.appendChild(elemCourseSelect);
		page.header.controls.appendChild(elemStudentMentor);
	}
	
	function _createCourseSelect() {
		var elemCourseSelect = document.createElement('select');
		elemCourseSelect.id = 'selectCourse';
		elemCourseSelect.classList.add('wl-control');
		elemCourseSelect.addEventListener('change',  _courseSelectChanged, false);
		
		var elemNoCourseOption = document.createElement('option');
		elemNoCourseOption.value = NO_COURSE;
		elemNoCourseOption.text = '<select a course>';
		elemCourseSelect.appendChild(elemNoCourseOption);
		
		var courseList = settings.courseList;
		for (var i = 0; i <  courseList.length; i++) {
			var elemOption = document.createElement('option');
			elemOption.value = courseList[i].coursekey;
			elemOption.text = courseList[i].fullname;
			elemCourseSelect.appendChild(elemOption);
		}

		page.courseselect = elemCourseSelect;
		
		return elemCourseSelect;
	}
		
	function _createStudentMentorChoice() {
		var elemWrapper = document.createElement('span');
		var elemStudent = document.createElement('input');
		var elemMentor = document.createElement('input');
		var elemStudentLabel = document.createElement('label');
		var elemMentorLabel = document.createElement('label');
		
		elemStudent.id = 'student'
		elemStudent.type='radio';
		elemStudent.name = 'student_mentor';
		elemStudent.checked = true;
		elemStudent.addEventListener('change',  _studentMentorChange, false);
		
		elemMentor.id = 'mentor';
		elemMentor.type='radio';
		elemMentor.name = 'student_mentor';
		elemMentor.addEventListener('change',  _studentMentorChange, false);
		
		elemStudentLabel.htmlFor = 'student';
		elemStudentLabel.innerHTML = 'student';
		elemStudentLabel.classList.add('wl-radio');
		
		elemMentorLabel.htmlFor = 'mentor';
		elemMentorLabel.innerHTML = 'mentor';
		elemMentorLabel.classList.add('wl-radio');
		
		elemWrapper.appendChild(elemStudent);
		elemWrapper.appendChild(elemStudentLabel);
		elemWrapper.appendChild(elemMentor);
		elemWrapper.appendChild(elemMentorLabel);

		page.studentwelcome = elemStudent;
		page.mentorwelcome = elemMentor;
		
		return elemWrapper;
	}
	
	function _makeButton(id, className, label, title, listener) {
		var btn = document.createElement('button');
		btn.id = id;
		btn.classList.add(className);
		btn.innerHTML = label;
		btn.title = title;
		btn.addEventListener('click', listener, false);
		return btn;
	}
	
	//---------------------------------------------------------
	// gather config information and call to start rendering
	//--------------------------------------------------------
	function _generateWelcomeLetter() {
		_getWelcomeLetterLayout(_renderWelcomeLetterMain);
	}

	function _clearWelcomeLetter() {
		var elemContents = document.getElementById('contents');
		while (elemContents.firstChild) {
			elemContents.removeChild(elemContents.firstChild);
		}
	}	
	
	//---------------------------------------------------------------------------------
	// use settings.config to load HTML include files and replace template variables
	// NOTE: template variables currently can't be used in the "main" section
	//--------------------------------------------------------------------------------
	function _renderWelcomeLetterMain() {
		var fulllayout = settings.fulllayout;
		var fullname = fulllayout.fullname;
		var layouttype = fulllayout.layouttype;
		var layoutMain = fulllayout.layout.main;
		var layoutelementMain = layoutElementId[layouttype].main;
		var defaultincludeMain = defaultIncludeFile[layouttype].main;
		
		var filename = layoutMain;
		if (filename == USE_DEFAULT) filename = defaultincludeMain;
		
		_includeHTML(layoutelementMain, settings.include + filename, _renderWelcomeLetterSubsections);
	}
	
	function _renderWelcomeLetterSubsections() {
		var fulllayout = settings.fulllayout;
		var fullname = fulllayout.fullname;
		var layouttype = fulllayout.layouttype;
		var layout = fulllayout.layout
		var layoutelement = layoutElementId[layouttype];
		var defaultinclude = defaultIncludeFile[layouttype];

		for (var key in layout) {
			if (key != 'main') {
				var elementId = layoutelement[key];
				var filename = layout[key];
				var defaultfilename = defaultinclude[key];
				if (filename == USE_DEFAULT) filename = defaultfilename;
				_includeHTML(elementId, settings.include + filename, _replaceAllTemplateVariables);
			}
		}
	}
	
	
	function _includeHTML(elemId, url, callback) {
		//console.log('_includeHTML: elemId=' + elemId + ' url=' + url); //+ ' cb=' + callback);
		$("#" + elemId).load(url, function(response, status, xhr) {
			if (status == "success") {
				callback(elemId);
			} else {
				var msg = 'failed to load ' + elemId + ' from ' + url;
				console.log(msg);
				_setNotice(msg);
			}
		});	
	}
	
	function _replaceAllTemplateVariables(elemId) {
		var templateElements = document.getElementById(elemId).getElementsByClassName(TEMPLATEVAR_CLASS);
		for (var i = 0; i < templateElements.length; i++) {
			var ihtml = templateElements.item(i).innerHTML;
			templateElements.item(i).innerHTML = _replaceTemplateVariables(ihtml);
		}
	}

	function _replaceTemplateVariables(str) {
		var matches = str.match(/\[\[.*\]\]/);

		for (var i = 0; i < matches.length; i++) {
			var replacement = _replacementSingleTemplateVariable(matches[i]);
			str = str.replace(matches[i], replacement);
		}
		
		return str;
	}
	
	function _replacementSingleTemplateVariable(str) {
		if (str == '[[coursefullname]]') return settings.fulllayout.fullname;

		return str;
	}

	//---------------------------------------
	// utility functions
	//----------------------------------------
	function _enableControls(enable) {
		page.courseselect.disabled = !enable;
		page.studentwelcome.disabled = !enable;
		page.mentorwelcome.disabled = !enable;
	}

	function _setNotice (label) {
		page.notice.innerHTML = label;

		if (label == '') {
			page.notice.style.display = 'none'; 
			page.notice.style.visibility = 'hidden';
		} else {
			page.notice.style.display = 'block';
			page.notice.style.visibility = 'visible';
		}
	}
		
	function _courseSelectChanged(evt) {
		if (page.courseselect.value == NO_COURSE) return;
		
		settings.coursekey = evt.target.value;
		_clearWelcomeLetter();
		_generateWelcomeLetter();
	}
	
	function _studentMentorChange(evt) {
		if (page.courseselect.value == NO_COURSE) return;

		settings.studentmentor = evt.target.id;
		_clearWelcomeLetter();
		_generateWelcomeLetter();
	}

	//--------------------------------------------------------------
	// build URL for use with Google sheet web API
	//--------------------------------------------------------------
		function _buildApiUrl (datasetname, coursekey, layouttype) {
		let url = API_BASE;
		url += '?key=' + API_KEY;
		url += datasetname && datasetname !== null ? '&dataset=' + datasetname : '';
		url += coursekey && coursekey !== null ? '&coursekey=' + coursekey : '';
		url += layouttype && layouttype !== null ? '&layouttype=' + layouttype : '';
		//console.log('buildApiUrl: url=' + url);
		
		return url;
	}
	
	//--------------------------------------------------------------
	// use Google Sheet web API to get course list
	//--------------------------------------------------------------
	function _getCourseList (callback) {
		_setNotice('loading course list...');

		fetch(_buildApiUrl('courselist'))
			.then((response) => response.json())
			.then((json) => {
				//console.log('json.status=' + json.status);
				if (json.status !== 'success') {
					_setNotice(json.message);
				}
				//console.log('json.data: ' + JSON.stringify(json.data));
				settings.courseList = json.data.courselist;
				_setNotice('');
				callback();
			})
			.catch((error) => {
				_setNotice('Unexpected error loading course list');
				console.log(error);
			})
	}
	
	//--------------------------------------------------------------
	// use Google Sheet web API to get layout for course
	//--------------------------------------------------------------
	function _getWelcomeLetterLayout (callback) {
		_setNotice('loading layout for course...');

		fetch(_buildApiUrl('layout', settings.coursekey, settings.studentmentor))
			.then((response) => response.json())
			.then((json) => {
				//console.log('json.status=' + json.status);
				if (json.status !== 'success') {
					_setNotice(json.message);
				}
				//console.log('json.data: ' + JSON.stringify(json.data));
				settings.fulllayout = json.data;
				_setNotice('');
				callback();
			})
			.catch((error) => {
				_setNotice('Unexpected error loading layout');
				console.log(error);
			})
	}
	
	return {
		init: init
 	};
}();
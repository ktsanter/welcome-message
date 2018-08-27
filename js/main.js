//
// TODO: move courseInfo to Google Sheet and deploy web API
// TODO: get course list from Web API
//
const app = function () {
	const PAGE_TITLE = 'Welcome letter message generator'
	const PAGE_VERSION = 'v0.1';
		
	//const API_BASE = 'https://script.google.com/macros/s/AKfycbymCm2GsamiaaWMfMr_o3rK579rz988lFK5uaBaRXVJH_8ViDg/exec';
	//const API_KEY = 'MVstandardsAPI';
	
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
	
	var courseInformation = {
		"game_design": {
			"fullname": "Advanced Programming: Game Design & Animation",
			"include": {
				"student": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"expectations1": USE_DEFAULT,
					"expectations2": USE_DEFAULT,
					"keypoints": "msg_keypoints_student_game_design.html"
				},
				"mentor": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"resources": USE_DEFAULT,
					"expectations": USE_DEFAULT,
					"response": USE_DEFAULT,
					"specialpop": USE_DEFAULT,
					"keypoints": "msg_keypoints_mentor_game_design.html"
				}
			}
		},
		"javascript": {
			"fullname": "Advanced Web Design: JavaScript",
			"include": {
				"student": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"expectations1": USE_DEFAULT,
					"expectations2": USE_DEFAULT,
					"keypoints": "msg_keypoints_student_javascript.html"
				},
				"mentor": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"resources": USE_DEFAULT,
					"expectations": USE_DEFAULT,
					"response": USE_DEFAULT,
					"specialpop": USE_DEFAULT,
					"keypoints": "msg_keypoints_mentor_javascript.html"
				}
			}
		},
		"apcsp1": {
			"fullname": "AP Computer Science Principles (Sem 1)",
			"include": {
				"student": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"expectations1": USE_DEFAULT,
					"expectations2": USE_DEFAULT,
					"keypoints": "msg_keypoints_student_apcsp1.html"
				},
				"mentor": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"resources": USE_DEFAULT,
					"expectations": USE_DEFAULT,
					"response": USE_DEFAULT,
					"specialpop": USE_DEFAULT,
					"keypoints": "msg_keypoints_mentor_apcsp1.html"
				}
			}
		},
		"html_css": {
			"fullname": "Basic Web Design: HTML & CSS",
			"include": {
				"student": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"expectations1": USE_DEFAULT,
					"expectations2": USE_DEFAULT,
					"keypoints": "msg_keypoints_student_html_css.html"
				},
				"mentor": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"resources": USE_DEFAULT,
					"expectations": USE_DEFAULT,
					"response": USE_DEFAULT,
					"specialpop": USE_DEFAULT,
					"keypoints": "msg_keypoints_mentor_html_css.html"
				}
			}
		},
		"diglit": {
			"fullname": "Digital Literacy & Programming",
			"include": {
				"student": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"expectations1": USE_DEFAULT,
					"expectations2": USE_DEFAULT,
					"keypoints": "msg_keypoints_student_diglit.html"
				},
				"mentor": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"resources": USE_DEFAULT,
					"expectations": USE_DEFAULT,
					"response": USE_DEFAULT,
					"specialpop": USE_DEFAULT,
					"keypoints": "msg_keypoints_mentor_diglit.html"
				}
			}
		},
		"fpa": {
			"fullname": "Foundations of Programming",
			"include": {
				"student": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"expectations1": USE_DEFAULT,
					"expectations2": USE_DEFAULT,
					"keypoints": "msg_keypoints_student_fpa.html"
				},
				"mentor": {
					"main": USE_DEFAULT,
					"contact": USE_DEFAULT,
					"generalinfo": USE_DEFAULT,
					"welcome": USE_DEFAULT,
					"resources": USE_DEFAULT,
					"expectations": USE_DEFAULT,
					"response": USE_DEFAULT,
					"specialpop": USE_DEFAULT,
					"keypoints": "msg_keypoints_mentor_fpa.html"
				}
			}
		}
	};

	/*---------------------------------------
	* get things going
	*----------------------------------------*/
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
				_initHeader();
			} else {
				_generateWelcomeLetter();
			}
		}
	}
	
	/*---------------------------------------
	* query params:
	*    navmode: display course dropdown and student/mentor options (other params ignored if navmode)
	*    coursekey:  short name for course (required unless navmode)
	*    student: make student welcome (either this or mentor is required unless navmode)
	*    mentor: make mentor welcome (either this or student is required unless navmode)
	*----------------------------------------*/
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

	/*---------------------------------------
	* initialization of output page including optional controls section for navmode
	*----------------------------------------*/
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
		
		for (var key in courseInformation) {
			var elemOption = document.createElement('option');
			elemOption.value = key;
			elemOption.text = courseInformation[key].fullname;
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
	
	/*---------------------------------------
	* gather config information and call to start rendering
	*----------------------------------------*/
	function _generateWelcomeLetter() {
		_getWelcomeLetterConfiguration(_renderWelcomeLetterMain);
	}
	
	function _getWelcomeLetterConfiguration(callback) {
		var coursedata = courseInformation[settings.coursekey]; // TODO: retrieve using Web API
		
		if (settings.studentmentor == 'student') {
			settings.config = {
				"fullname": coursedata.fullname, 
				"include": coursedata.include.student, 
				"layoutelement": layoutElementId.student, 
				"defaultinclude": defaultIncludeFile.student
			};
		} else {
			settings.config = {
				"fullname": coursedata.fullname, 
				"include": coursedata.include.mentor, 
				"layoutelement": layoutElementId.mentor, 
				"defaultinclude": defaultIncludeFile.mentor
			};
		}
		
		callback();
	}

	function _clearWelcomeLetter() {
		var elemContents = document.getElementById('contents');
		while (elemContents.firstChild) {
			elemContents.removeChild(elemContents.firstChild);
		}
	}	
	
	/*---------------------------------------
	* use settings.config to load HTML include files and replace template variables
	* NOTE: template variables currently can't be used in the "main" section
	*----------------------------------------*/
	function _renderWelcomeLetterMain() {
		var config = settings.config;
		var fullname = config.fullname;
		var include = config.include.main;
		var layoutelement = config.layoutelement.main;
		var defaultinclude = config.defaultinclude.main;
		
		var filename = include;
		if (include == USE_DEFAULT) filename = defaultinclude
		
		_includeHTML(layoutelement, settings.include + filename, _renderWelcomeLetterSubsections);
	}
	
	function _renderWelcomeLetterSubsections() {
		var config = settings.config;
		var fullname = config.fullname;
		var include = config.include;
		var layoutelement = config.layoutelement;
		var defaultinclude = config.defaultinclude;
		
		for (var key in include) {
			if (key != 'main') {
				var elementId = layoutelement[key];
				var filename = include[key];
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
		if (str == '[[coursefullname]]') return courseInformation[settings.coursekey].fullname;

		return str;
	}

	/*---------------------------------------
	* utility functions
	*----------------------------------------*/
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
		_generateWelcomeLetter();
	}

	return {
		init: init
 	};
}();
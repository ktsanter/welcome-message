//
// TODO: move courseInfo to Google Sheet and deploy web API
// TODO: add removal of children on reload for navmode
//
const app = function () {
	const PAGE_TITLE = 'Welcome letter message generator'
	const PAGE_VERSION = 'v0.1';
		
	//const API_BASE = 'https://script.google.com/macros/s/AKfycbymCm2GsamiaaWMfMr_o3rK579rz988lFK5uaBaRXVJH_8ViDg/exec';
	//const API_KEY = 'MVstandardsAPI';
	
	const NO_COURSE = 'NO_COURSE';
	const TEMPLATE_CLASS = 'wl-has-template-item';
	
	const page = {};
	const settings = {};
	
	const courseInfo = {
		"game_design": {
			"fullname": "Advanced Programming: Game Design & Animation"
		},
		"javascript": {
			"fullname": "Advanced Web Design: JavaScript"
		},
		"apcsp1": {
			"fullname": "AP Computer Science Principles (Sem 1)"
		},
		"html_css": {
			"fullname": "Basic Web Design: HTML & CSS"
		},
		"diglit": {
			"fullname": "Digital Literacy & Programming"
		},
		"fpa": {
			"fullname": "Foundations of Programming"
		}
	};
	
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
	
	function _initializeSettings() {
		/*
		* params:
		*    navmode: display course dropdown and student/mentor options (other params ignored if navmode)
		*    coursekey:  short name for course (required unless navmode)
		*    student: make student welcome (either this or mentor is required unless navmode)
		*    mentor: make mentor welcome (either this or student is required unless navmode)
		*/
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
		
		for (var key in courseInfo) {
			var elemOption = document.createElement('option');
			elemOption.value = key;
			elemOption.text = courseInfo[key].fullname;
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
	
	function _generateWelcomeLetter() {
		if (settings.studentmentor == 'student') {
			_generateStudentWelcomeLetter();
		} else {
			_generateMentorWelcomeLetter();
		}
	}
	
	function _generateStudentWelcomeLetter() {
		_includeHTML("contents", "./include/msg_student_main.html", _loadStudentSubsections);
	}
	
	function _loadStudentSubsections(elemId) {		
		_includeHTML("msg_student_contact", "./include/msg_student_contact.html", _replaceAllTemplateVariables);
		_includeHTML("msg_generalinfo", "./include/msg_student_generalinfo.html", _replaceAllTemplateVariables);
		_includeHTML("msg_welcome", "./include/msg_student_welcome.html", _replaceAllTemplateVariables);
		_includeHTML("msg_exp1", "./include/msg_student_exp1.html", _replaceAllTemplateVariables);
		_includeHTML("msg_exp2", "./include/msg_student_exp2.html", _replaceAllTemplateVariables);

		_includeHTML("msg_student_keypoints", "./include/msg_student_keypoints_diglit.html", _replaceAllTemplateVariables);
	}
	
	function _generateMentorWelcomeLetter() {
		_includeHTML("contents", "./include/msg_mentor_main.html", _loadMentorSubsections);
	}
	
	function _loadMentorSubsections(elemId) {
		console.log('load mentor');
		_includeHTML("msg_mentor_contact", "./include/msg_mentor_contact.html", _replaceAllTemplateVariables);
		_includeHTML("msg_mentor_generalinfo", "./include/msg_mentor_generalinfo.html", _replaceAllTemplateVariables);
		_includeHTML("msg_mentor_welcome", "./include/msg_mentor_welcome.html", _replaceAllTemplateVariables);
		_includeHTML("msg_mentor_resources", "./include/msg_mentor_resources.html", _replaceAllTemplateVariables);
		_includeHTML("msg_mentor_exp1", "./include/msg_mentor_exp1.html", _replaceAllTemplateVariables);
		_includeHTML("msg_mentor_response", "./include/msg_mentor_response.html", _replaceAllTemplateVariables);
		_includeHTML("msg_mentor_specialpop", "./include/msg_mentor_specialpop.html", _replaceAllTemplateVariables);

		_includeHTML("msg_mentor_keypoints", "./include/msg_mentor_keypoints_diglit.html", _replaceAllTemplateVariables);
	}
	
	function _includeHTML(elemId, url, callback) {
		console.log('elemId=' + elemId + ' cb=' + callback);
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
		var templateElements = document.getElementById(elemId).getElementsByClassName(TEMPLATE_CLASS);
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
		if (str == '[[coursefullname]]') return courseInfo[settings.coursekey].fullname;

		return str;
	}
	
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
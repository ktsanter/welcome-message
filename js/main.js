//
// TODO: move courseInfo to Google Sheet and deploy web API
// TODO: handle AP general info
//
const app = function () {
	const PAGE_TITLE = 'Welcome letter message generator'
	const PAGE_VERSION = 'v0.1';
		
	//const API_BASE = 'https://script.google.com/macros/s/AKfycbymCm2GsamiaaWMfMr_o3rK579rz988lFK5uaBaRXVJH_8ViDg/exec';
	//const API_KEY = 'MVstandardsAPI';
	
	const NO_COURSE = 'NO_COURSE';
	const TEMPLATE_CLASS = 'wl-has-template-item';
	
	const page = {};
	const settings = {
		"include": "./include/",
		"standardexpectations": {"elementid": "msg_exp1", "file": "msg_student_exp1.html"},
		"apexpectations": {"elementid": "msg_exp1", "file": "msg_student_exp1_ap.html"}
	};
	
	const generalInfo = {
		"student": {
			"main": {"elementid": "contents", "file": "msg_student_main.html"},
			"contact": {"elementid": "msg_student_contact", "file": "msg_student_contact.html"},
			"generalinfo": {"elementid": "msg_generalinfo", "file":  "msg_student_generalinfo.html"},
			"welcome": {"elementid": "msg_welcome", "file":  "msg_student_welcome.html"},
			"expectations2": {"elementid": "msg_exp2", "file":  "msg_student_exp2.html"}
		},
		"mentor": {
			"main": {"elementid": "contents", "file":  "msg_mentor_main.html"},
			"contact": {"elementid": "msg_mentor_contact", "file":  "msg_mentor_contact.html"},
			"generalinfo": {"elementid": "msg_mentor_generalinfo", "file":  "msg_mentor_generalinfo.html"},
			"welcome": {"elementid": "msg_mentor_welcome", "file":  "msg_mentor_welcome.html"},
			"resources": {"elementid": "msg_mentor_resources", "file":  "msg_mentor_resources.html"},
			"expectations": {"elementid": "msg_mentor_exp1", "file":  "msg_mentor_exp1.html"},
			"response": {"elementid": "msg_mentor_response", "file":  "msg_mentor_response.html"},
			"specialpop": {"elementid": "msg_mentor_specialpop", "file":  "msg_mentor_specialpop.html"}
		}		
	}

	const courseInfo = {
		"game_design": {
			"fullname": "Advanced Programming: Game Design & Animation",
			"include": {
				"student": [
					{"elementid": "msg_exp1", "file":  settings.standardexpectations.file},
					{"elementid": "msg_student_keypoints", "file":  "msg_keypoints_student_game_design.html"}
				],
				"mentor": [
					{"elementid": "msg_mentor_keypoints", "file":  "msg_keypoints_mentor_game_design.html"}
				]
			}				
		},
		"javascript": {
			"fullname": "Advanced Web Design: JavaScript",
			"include": {
				"student": [
					{"elementid": "msg_exp1", "file":  settings.standardexpectations.file},
					{"elementid": "msg_student_keypoints", "file":  "msg_keypoints_student_javascript.html"}
				],
				"mentor": [
					{"elementid": "msg_mentor_keypoints", "file":  "msg_keypoints_mentor_javascript.html"}
				]
			}				
		},
		"apcsp1": {
			"fullname": "AP Computer Science Principles (Sem 1)",
			"include": {
				"student": [
					{"elementid": "msg_exp1", "file":  settings.apexpectations.file},
					{"elementid": "msg_student_keypoints", "file":  "msg_keypoints_student_apcsp1.html"}
				],
				"mentor": [
					{"elementid": "msg_mentor_keypoints", "file":  "msg_keypoints_mentor_apcsp1.html"}
				]
			}
		},
		"html_css": {
			"fullname": "Basic Web Design: HTML & CSS",
			"include": {
				"student": [
					{"elementid": "msg_exp1", "file":  settings.standardexpectations.file},
					{"elementid": "msg_student_keypoints", "file":  "msg_keypoints_student_html_css.html"}
				],
				"mentor": [
					{"elementid": "msg_mentor_keypoints", "file":  "msg_keypoints_mentor_html_css.html"}
				]
			}				
		},
		"diglit": {
			"fullname": "Digital Literacy & Programming",
			"include": {
				"student": [
					{"elementid": "msg_exp1", "file":  settings.standardexpectations.file},
					{"elementid": "msg_student_keypoints", "file":  "msg_keypoints_student_diglit.html"}
				],
				"mentor": [
					{"elementid": "msg_mentor_keypoints", "file":  "msg_keypoints_mentor_diglit.html"}
				]
			}				
		},
		"fpa": {
			"fullname": "Foundations of Programming",
			"include": {
				"student": [
					{"elementid": "msg_exp1", "file":  settings.standardexpectations.file},
					{"elementid": "msg_student_keypoints", "file":  "msg_keypoints_student_fpa.html"}
				],
				"mentor": [
					{"elementid": "msg_mentor_keypoints", "file":  "msg_keypoints_mentor_fpa.html"}
				]
			}				
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
	
	function _clearWelcomeLetter() {
		var elemContents = document.getElementById('contents');
		while (elemContents.firstChild) {
			elemContents.removeChild(elemContents.firstChild);
		}
	}
	
	function _generateStudentWelcomeLetter() {
		var item = generalInfo.student.main;
		_includeHTML(item.elementid, settings.include + item.file, _loadStudentSubsections);
	}
	
	function _generateMentorWelcomeLetter() {
		var item = generalInfo.mentor.main;
		_includeHTML(item.elementid, settings.include + item.file, _loadMentorSubsections);
	}
	
	function _loadStudentSubsections(elemId) {		
		// general info
		for (var key in generalInfo.student) {
			if (key != 'main') {
				var item = generalInfo.student[key];
				_includeHTML(item.elementid, settings.include + item.file, _replaceAllTemplateVariables);
			}
		}
		
		// course specific info
		var includeItems = courseInfo[settings.coursekey].include.student;
		for (var i = 0; i < includeItems.length; i++) {
			var item = includeItems[i];
			_includeHTML(item.elementid, settings.include + item.file, _replaceAllTemplateVariables);
		}
	}
	
	function _loadMentorSubsections(elemId) {
		// general info
		for (var key in generalInfo.mentor) {
			if (key != 'main') {
				var item = generalInfo.mentor[key];
				_includeHTML(item.elementid, settings.include + item.file, _replaceAllTemplateVariables);
			}
		}

		// course specific info
		var includeItems = courseInfo[settings.coursekey].include.mentor;
		for (var i = 0; i < includeItems.length; i++) {
			var item = includeItems[i];
			_includeHTML(item.elementid, settings.include + item.file, _replaceAllTemplateVariables);
		}
	}
	
	function _includeHTML(elemId, url, callback) {
//		console.log('elemId=' + elemId + ' url=' + url + ' cb=' + callback);
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
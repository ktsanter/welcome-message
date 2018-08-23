//
// TODO: move courseInfo to Google Sheet and deploy web API
//
const app = function () {
	const PAGE_TITLE = 'Welcome letter message generator'
	const PAGE_VERSION = 'v0.1';
		
	//const API_BASE = 'https://script.google.com/macros/s/AKfycbymCm2GsamiaaWMfMr_o3rK579rz988lFK5uaBaRXVJH_8ViDg/exec';
	//const API_KEY = 'MVstandardsAPI';
	
	const NO_COURSE = 'NO_COURSE';
	
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
		console.log('generate student welcome letter for ' + settings.coursekey);
		//$("#msg_header").load('./import/msg_header.html');
		_includeHTML()
	}
	
	function _generateMentorWelcomeLetter() {
		console.log('generate mentor welcome letter for ' + settings.coursekey);
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

	function _includeHTML() {
		console.log('_includeHTML begin');
		var z, i, elmnt, file, xhttp;
		/*loop through a collection of all HTML elements:*/
		z = document.getElementsByTagName("*");
		
		for (i = 0; i < z.length; i++) {
			elmnt = z[i];
			/*search for elements with a certain atrribute:*/
			file = elmnt.getAttribute("w3-include-html");

			if (file) {
				console.log('getting include for ' + elmnt.id + 'file=' + file);
				/*make an HTTP request using the attribute value as the file name:*/
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {elmnt.innerHTML = this.responseText;}
						if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
						/*remove the attribute, and call this function once more:*/
						elmnt.removeAttribute("w3-include-html");
						_includeHTML();
					}
				}      
				xhttp.open("GET", file, true);
				xhttp.send();
				/*exit the function:*/
				return;
			}
			console.log('_includeHTML end');
		}
	}
	
	return {
		init: init
 	};
}();
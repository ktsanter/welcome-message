"use strict";
//-----------------------------------------------------------------------------------
// welcome message 
//-----------------------------------------------------------------------------------
// TODO: replace document.getElementById with something that works locally?
//-----------------------------------------------------------------------------------
class WelcomeMessage {
  constructor() {
    this._version = '0.01';
    this._container = null;
  }
  
  setParams(audience, config, standards, passwordlink) {
    this._audience = audience;
    this._config = config;
    this._standards = standards;
    this._passwordlink = passwordlink;
    this._removeContainer();    
  }
  
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  renderPage(appendTo) {
    this._removeContainer();
    this._container = CreateElement._createDiv('containerWelcomeMessage', 'container-fluid', this._config.container);
    appendTo.appendChild(this._container);
    
    WelcomeMessage._renderSection('innercontainer', this._config.innercontainer, this._standards);
    if (this._audience == 'mentor') WelcomeMessage._renderPasswordSection('passwords', this._standards.Assessment.Assess_passwords, this._passwordlink);
    
    for (var key in this._config) {
      if (key != 'container' && key != 'innercontainer') WelcomeMessage._renderSection(key, this._config[key], this._standards);
    }
    
    this._changeLinkTargets();
    this._eliminateEmptyListItems();
  }
  
  _removeContainer() {
    if (this.container) {
      this._container.parentNode.removeChild(this._container);
      this._container = null;
    }
  }
    
  static _renderSection(sectionId, sectionMarkdown, standards) {
    var elem = document.getElementById(sectionId);
    var markdown = WelcomeMessage._replaceTemplateVariables(sectionMarkdown, standards);
    elem.innerHTML = WelcomeMessage._convertMarkdownToHTML(markdown);
  }
  
  static _renderPasswordSection(sectionId, passwordStandard, passwordLink) {
    var section = document.getElementById(sectionId);

    if (passwordStandard != '' && passwordStandard != 'There are no exam passwords')   {
      section.appendChild(CreateElement._createLink(null, null,  'course passwords', passwordLink));
    }
  }
  
  static _replaceTemplateVariables(str, standards) {
    var standardsVars = str.match(/\[\[([^\[^\]^.]*)\.([^\[^\]]*)\]\]/g);  // should match [[major.minor]]
    if (standardsVars) {
      for (var i = 0; i < standardsVars.length; i++) {
        var templateVar = standardsVars[i];
        var key = templateVar.slice(2,-2);
        var major = key.match(/([^\.]*)\./)[1];
        var minor = key.match(/\.([^\.]*)/)[1];
        var standardVal = standards[major][minor];
        if (standardVal.toLowerCase() == 'n/a') standardVal = '';
        str = str.replace(templateVar, standardVal);
      }
    }
    
    return str; 
  }

  _changeLinkTargets() {
    var links = this._container.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('mailto:') != 0) {
        links[i].target = '_blank';
      }
    }
  }
  
  _eliminateEmptyListItems() {
    var toElim = [];
    var listItems = this._container.getElementsByTagName('li');
    for (var i = 0; i < listItems.length; i++) {
      if (listItems[i].innerHTML == '') {
        toElim.push(listItems[i]);
      }
    }
    
    for (var i = 0; i < toElim.length; i++) {
      toElim[i].parentNode.removeChild(toElim[i]);
    }
  }
  
	//------------------------------------------------------------------
	// process MarkDown
	//------------------------------------------------------------------  
  static _convertMarkdownToHTML(text) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(text);
    var result = writer.render(parsed);

    return result;
  }
}

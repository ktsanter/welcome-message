"use strict";
//-----------------------------------------------------------------------------------
// Student infoDeck Chrome extension
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------
class CreateElement {
  constructor () {
    this._version = '0.01';
  }
      
  static _createElement(elemType, id, classList) {
    var elem = document.createElement(elemType);
    if (id && id != '') elem.id = id;
    CreateElement.addClassList(elem, classList);
    return elem;
  }
  
  static addClassList(elem, classList) {
    if (classList && classList != '') {
      var splitClass = classList.split(' ');
      for (var i = 0; i < splitClass.length; i++) {
        elem.classList.add(splitClass[i]);
      }
    }
  }
  
  static createDiv(id, classList, html, handler) {
    var elem = CreateElement._createElement('div', id, classList);
    if (html != null) elem.innerHTML = html;
    
    return elem;
  }
  
  static createSpan(id, classList, html) {
    var elem = CreateElement._createElement('span', id, classList);
    if (html != null) elem.innerHTML = html;
    
    return elem;
  }
  
  static createImage(id, classList, src, title, handler, dblclickhandler) {
    var elem = CreateElement._createElement('img', id, classList);
    if (src != null) elem.src = src;
    if (title) elem.title = title;
    if (handler) elem.addEventListener('click', handler, false);
    if (dblclickhandler) elem.addEventListener('dblclick', dblclickhandler, false);
    
    return elem;
  }
    
  static createIcon(id, classList, title, handler, dblclickhandler) {
    var elem = CreateElement._createElement('i', id, classList);
    if (title) elem.title = title;
    if (handler) elem.addEventListener('click', handler, false);
    if (dblclickhandler) elem.addEventListener('dblclick', dblclickhandler, false);
    
    return elem;
  }

  static createButton(id, classList, label, title, handler) {
    var elem = CreateElement._createElement('button', id, classList);
    elem.innerHTML = label;
    elem.title = title;
    if (handler) elem.addEventListener('click', e => handler(e), false);
    
    return elem;
  }
  
  static createLink(id, classList, title, href, handler) {
    var elem = CreateElement._createElement('a', id, classList);
    elem.innerHTML = title;
    elem.href = href;
    if (handler) elem.addEventListener('click', handler, false);
    
    return elem;
  }

  static createTextArea(id, classList) {
    var elem = CreateElement._createElement('textarea', id, classList);
    
    return elem;
  }
  
  static createHR(id, classList) {
    var elem = CreateElement._createElement('hr', id, classList);
    
    return elem;
  }

  static createBR(id, classList) {
    var elem = CreateElement._createElement('br', id, classList);
    
    return elem;
  }

  static createSelect(id, classList, changehandler) {
    var elem = CreateElement._createElement('select', id, classList);
    if (changehandler) elem.addEventListener('change', changehandler, false);
    
    return elem;
  }
  
   static createOption(id, classList, value, label) {
    var elem = CreateElement._createElement('option', id, classList);
    elem.value = value;
    elem.innerHTML = label;
    
    return elem;
  }
  
  static createTextInput(id, classList, initialContents) {
    var elem = CreateElement._createElement('input', id, classList);
    elem.type = 'text';
    if (initialContents) elem.value = initialContents;
    
    return elem;
  }
   
  static createCheckbox(id, classList, groupName, buttonValue, displayValue, checked, handler) {
    var container = CreateElement.createSpan(null, null);
    
    var elem = CreateElement._createElement('input', id, classList);
    elem.type = 'checkbox';
    elem.name = groupName;
    elem.value = buttonValue;
    elem.checked = checked;
    elem.addEventListener('click', e => handler(e), false);
    container.appendChild(elem);
    
    var label = CreateElement._createElement('label', id, classList);
    label.innerHTML = displayValue;
    container.appendChild(label);

    return container;
  }
  
  static createRadio(id, classList, groupName, buttonValue, displayValue, checked, handler) {
    var container = CreateElement.createSpan(null, null);
    
    var elem = CreateElement._createElement('input', id, classList);
    elem.type = 'radio';
    elem.name = groupName;
    elem.value = buttonValue;
    elem.checked = checked;
    elem.addEventListener('click', e => handler(e), false);
    container.appendChild(elem);
    
    var label = CreateElement._createElement('label', id, classList);
    label.htmlFor = id;
    label.innerHTML = displayValue;
    container.appendChild(label);

    return container;
  }
}

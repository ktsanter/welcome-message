define(function (require) {
  require('navmain');
  require('welcome_message');
  require('google_webapp_interface');
  require('create_element');
  require('standard_notice');
  require('clipboard_copy');
  require('markdowntohtml');

  document.addEventListener('DOMContentLoaded', app.init());
});
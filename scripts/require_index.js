define(function (require) {
  require('main');
  require('welcome_message');
  require('google_webapp_interface');
  require('create_element');
  require('standard_notice');

  document.addEventListener('DOMContentLoaded', app.init());
});
//= require jquery
//= require rails
$(function() {
  var faye = new Faye.Client('http://127.0.0.1:9292/faye');
  faye.subscribe("/messages/new", function(data) {
    eval(data);
  });
});

# railschat
Live chat integration

bash

gem install faye
rackup faye.ru -s thin -E production
curl http://localhost:9292/faye -d 'message={[channel]("/messages/new",) [data]("hello"}')

config/application.rb

require "net/http"

config/initializers/faye_token.rb

FAYE_TOKEN = "anything"

application_helper.rb

def broadcast(channel, &block)
  message = {:channel => channel, :data => capture(&block), :ext => {:auth_token => FAYE_TOKEN}}
  uri = URI.parse("http://localhost:9292/faye")
  Net::HTTP.post_form(uri, :message => message.to_json)
end

faye.ru

require 'faye'
require File.expand_path('../config/initializers/faye_token.rb', __FILE__)
class ServerAuth
  def incoming(message, callback)
    if message['channel'] !~ %r{^/meta/}
      if message['ext']['auth_token'] != FAYE_TOKEN
        message['error'] = 'Invalid authentication token'
      end
    end
    callback.call(message)
  end
  # IMPORTANT: clear out the auth token so it is not leaked to the client
  def outgoing(message, callback)
    if message['ext'] && message['ext']['auth_token']
      message['ext'] = {} 
    end
    callback.call(message)
  end
end
faye_server = Faye::RackAdapter.new(:mount => '/faye', :timeout => 45)
faye_server.add_extension(ServerAuth.new)
run faye_server

Views message HTML
<% broadcast "/messages/new" do %>
  $("#chat").append("<%= escape_javascript render(@message) %>");
<% end %>
$("#new_message")[0].reset();
application.js
$(function() {
  var faye = new Faye.Client('http://localhost:9292/faye');
  faye.subscribe("/messages/new", function(data) {
    eval(data);
  });
});

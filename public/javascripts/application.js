$(function() {
  var token = Math.random().toString(36).substring(8);
  var interval = 50;
  var timer;

  var faye_url = "//"+ document.location.hostname + ":9090/faye";

  $.getScript(faye_url + "/client.js", function(data, textStatus, jqxhr) {
    var faye = new Faye.Client(faye_url);

    faye.subscribe("/messages/new", function(data) {
      if(data.token != token){
        var control = $("#" + data.id)[0];
        control.disabled = true;

        if(data.type == "checkbox") {
          control.checked = data.value;
        } else if(data.type == "range") {
          control.value = data.value;
        }
        control.disabled = false;
      }
    });
  });

  $("[type=checkbox]").change(function() {
    push(this.id, this.checked, this.type);
  });

  $("[type=range]").change(function() {
    clearTimeout(timer);
    var element = this;
    timer = setTimeout(function(){
      push(element.id, element.value, element.type);
    }, interval);
  });

  function push(id, value, type){
    $.ajax({
      type: "POST",
      url: faye_url,
      dataType: 'json',
      data: "message={ \"channel\": \"/messages/new\", \"data\": { \"auth_token\": \"" + auth_token + "\", \"id\": \"" + id + "\", \"value\": " + value + ", \"type\": \"" + type + "\", \"token\": \"" + token + "\" } }",
    });
  }
});

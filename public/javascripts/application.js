$(function() {
  var token = Math.random().toString(36).substring(8),
      interval = 50,
      timer,
      fayeUrl = "//"+ document.location.hostname + ":9090/faye",
      push = function (id, value, type) {
        $.ajax({
          type: "POST",
          url: fayeUrl,
          dataType: 'json',
          data: "message=" + JSON.stringify({
            "channel": "/messages/new",
            "data": {
              "auth_token": auth_token,
              "id": id,
              "value": value,
              "type": type,
              "token": token
            }
          })
        });
      },
      setCurrentValue = function () {
        this.innerText = this.previousSibling.previousSibling.value;
      };

  $("[type=range] + span").each(setCurrentValue);
  $.getScript(fayeUrl + "/client.js", function(data, textStatus, jqxhr) {
    var faye = new Faye.Client(fayeUrl);

    faye.subscribe("/messages/new", function(data) {
      if (data.token !== token) {
        var control = document.getElementById(data.id);
        control.disabled = true;
        if (data.type === "checkbox") {
          control.checked = data.value;
        } else if (data.type === "range") {
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
    var element = this;
    clearTimeout(timer);
    timer = setTimeout(function(){
      push(element.id, element.value, element.type);
      element.nextSibling.nextSibling.innerText = element.value;
    }, interval);
  });

  
});

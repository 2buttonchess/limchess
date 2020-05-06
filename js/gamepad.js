var selectableItems;
var selectItemsIdx = 0;
var isSlider = false;
var isThinking = false;

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  $(selectableItems[selectItemsIdx]).css("background-color", "")
  selectItemsIdx = 0
  $(selectableItems[selectItemsIdx]).focus()
}

function canGame() {
    return "getGamepads" in navigator;
}

function checkGamepad() {
  if(isThinking) {
    return;
  }

  var gp = navigator.getGamepads()[0];
  var axeLR = gp.axes[0];
  var axeUD = gp.axes[1];
  if(axeUD < -0.5) {
    //up
    if(selectableItems[selectItemsIdx].localName == "button") {
      $(selectableItems[selectItemsIdx]).click()
    } else if(selectableItems[selectItemsIdx].localName == "a"){
      window.location.href = selectableItems[selectItemsIdx].href
    } else if(isSlider){
      $(selectableItems[selectItemsIdx]).trigger('input')
      isSlider = false
    } else {
      isSlider = true
    }
  } else if(axeUD > 0.5) {
    //down
    var y = $(window).scrollTop();
    $(window).scrollTop(y+50); 
  }
  if(selectableItems[selectItemsIdx].localName == "button") {
    $(selectableItems[selectItemsIdx]).css("background-color", "")
  } else if(selectableItems[selectItemsIdx].id == "numberMoves") {
    $("#numberMovesContainer").css("border", "none")
    const val = $("#numberMoves").val()
    if(val == 11) {
      $("output[for=number]").html("all&emsp;")
    } else {
      $("output[for=number]").html(val + "&emsp;")
    }
  } else if(selectableItems[selectItemsIdx].id == "difficultySlider") {
    $("#difficultyContainer").css("border", "none")
    const val = $("#difficultySlider").val()
    $("output[for=difficulty]").html("&ensp;" + val + "&emsp;")
  } else {
    $(selectableItems[selectItemsIdx]).css("border", "none")
  }

  //left
  if(axeLR < -0.5) {
    if(isSlider) {
      const val = parseInt($(selectableItems[selectItemsIdx]).val())
      const min = parseInt(document.getElementById(selectableItems[selectItemsIdx].id).getAttribute('min'))
      if(val != min) {
        document.getElementById(selectableItems[selectItemsIdx].id).setAttribute('value', val-1)
      }
    } else {
      if(selectItemsIdx == 0) {
        selectItemsIdx = selectableItems.length - 1
      } else {
        selectItemsIdx--
      }
    }
  //right
  } else if(axeLR > 0.5) {
    if(isSlider) {
      const val = parseInt($(selectableItems[selectItemsIdx]).val())
      const max = parseInt(document.getElementById(selectableItems[selectItemsIdx].id).getAttribute('max'))
      if(val != max) {
        document.getElementById(selectableItems[selectItemsIdx].id).setAttribute('value', val+1)
      }
    } else {
      if(selectItemsIdx == selectableItems.length - 1) {
        selectItemsIdx = 0
      } else {
        selectItemsIdx++
      }
    }
  }

  if(selectableItems[selectItemsIdx].localName == "button") {
    $(selectableItems[selectItemsIdx]).css("background-color", "yellow")
  } else if(selectableItems[selectItemsIdx].id == "numberMoves") {
    $("#numberMovesContainer").css("border", "0.5rem solid yellow")
    const val = $("#numberMoves").val()
    if(val == 11) {
      $("output[for=number]").html("&ensp;all&emsp;")
    } else {
      $("output[for=number]").html("&ensp;" + val + "&emsp;")
    }
  } else if(selectableItems[selectItemsIdx].id == "difficultySlider") {
    $("#difficultyContainer").css("border", "0.5rem solid yellow")
    const val = $("#difficultySlider").val()
    $("output[for=difficulty]").html("&ensp;" + val + "&emsp;")
  } else {
    $(selectableItems[selectItemsIdx]).css("border", "0.5rem solid yellow")
  }
}

$(document).ready(() => {
  var hasGP = false;
  var gp;
  selectableItems = document.getElementsByTagName("BODY")[0].querySelectorAll("button, a, input")
  $(selectableItems[0]).focus()
  if(canGame()) {

    $(window).on("gamepadconnected", function() {
        hasGP = true;
        $("#gamepadStatus").find("p").html("Gamepad device has been connected!")
        document.activeElement.blur()
        gp = window.setInterval(checkGamepad,125);
    });

    $(window).on("gamepaddisconnected", function() {
      $("#gamepadStatus").find("p").html("Gamepad device not connected")
      if(selectableItems[selectItemsIdx].localName == "button") {
        $(selectableItems[selectItemsIdx]).css("background-color", "")
      } else {
        $(selectableItems[selectItemsIdx]).css("border", "none")
      }
      window.clearInterval(gp)
    });

    //setup an interval for Chrome
    var checkGP = window.setInterval(function() {
        if(navigator.getGamepads()[0]) {
            if(!hasGP) $(window).trigger("gamepadconnected");
            window.clearInterval(checkGP);
        }
    }, 500);
  }

})

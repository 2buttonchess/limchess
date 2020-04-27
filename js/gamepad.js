var selectableItems;
var selectItemsIdx = 0;

function canGame() {
    return "getGamepads" in navigator;
}

function checkGamepad() {
  var gp = navigator.getGamepads()[0];
  var axeLR = gp.axes[0];
  var axeUD = gp.axes[1];
  if(axeUD < -0.5) {
    //up
    if(selectableItems[selectItemsIdx].localName == "button") {
      $(selectableItems[selectItemsIdx]).click()
    } else if(selectableItems[selectItemsIdx].localName == "a"){
      window.location.href = selectableItems[selectItemsIdx].href
    } else {
      console.log('select')
      $(selectableItems[selectItemsIdx]).select()
    }
  } else if(axeUD > 0.5) {
    //down
    var y = $(window).scrollTop();
    $(window).scrollTop(y+50); 
  }
  
  if(selectableItems[selectItemsIdx].localName == "button") {
    $(selectableItems[selectItemsIdx]).css("background-color", "")
  } else {
    $(selectableItems[selectItemsIdx]).css("border", "none")
  }

  if(axeLR < -0.5) {
    if(selectItemsIdx == 0) {
      selectItemsIdx = selectableItems.length - 1
    } else {
      selectItemsIdx--
    }
  } else if(axeLR > 0.5) {
    if(selectItemsIdx == selectableItems.length - 1) {
      selectItemsIdx = 0
    } else {
      selectItemsIdx++
    }
  }

  if(selectableItems[selectItemsIdx].localName == "button") {
    $(selectableItems[selectItemsIdx]).css("background-color", "yellow")
  } else {
    $(selectableItems[selectItemsIdx]).css("border", "0.5rem solid yellow")
  }
}

$(document).ready(() => {
  var hasGP = false;
  var gp;
  selectableItems = document.getElementsByTagName("BODY")[0].querySelectorAll("button, a, select")
  if(canGame()) {

    $(window).on("gamepadconnected", function() {
        hasGP = true;
        console.log("connection event");
        gp = window.setInterval(checkGamepad,125);
    });

    $(window).on("gamepaddisconnected", function() {
        console.log("disconnection event");
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

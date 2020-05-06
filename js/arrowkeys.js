$(document).ready(() => {  
  window.addEventListener("keydown", function(e) {
    // turn off default left/right arrows changing slider
    if([37, 39].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
  }, false);

  $("body").keydown(function(e) {
    if(e.keyCode == 37 || e.keyCode == 39) {  
      if(isSlider) {
        if(e.keyCode == 37) { // left
            $(selectableItems[selectItemsIdx]).trigger('input')
            isSlider = false
        }
        else { // right
          const val = parseInt($(selectableItems[selectItemsIdx]).val())
          const max = parseInt(document.getElementById(selectableItems[selectItemsIdx].id).getAttribute('max'))
          const min = parseInt(document.getElementById(selectableItems[selectItemsIdx].id).getAttribute('min'))
          if(val == max) {
            document.getElementById(selectableItems[selectItemsIdx].id).setAttribute('value', min)
          } else {
            document.getElementById(selectableItems[selectItemsIdx].id).setAttribute('value', val+1)
          }
        }
        if(selectableItems[selectItemsIdx].id == "numberMoves") {
          const val = $("#numberMoves").val()
          if(val == 11) {
            $("output[for=number]").html("&ensp;all&emsp;")
          } else {
            $("output[for=number]").html("&ensp;" + val + "&emsp;")
          }
        } else {
          const val = $("#difficultySlider").val()
          $("output[for=difficulty]").html("&ensp;" + val + "&emsp;")
        }
      } else { 
            if(e.keyCode == 37) { //left
                if(selectableItems[selectItemsIdx].localName == "button") {
                    $(selectableItems[selectItemsIdx]).click()
                } else if(selectableItems[selectItemsIdx].localName == "a"){
                    window.location.href = selectableItems[selectItemsIdx].href
                } else {
                    isSlider = true
                }
            } else { // right
                if(selectItemsIdx == selectableItems.length - 1) {
                    selectItemsIdx = 0
                } else {
                    selectItemsIdx++
                }
                $(selectableItems[selectItemsIdx]).focus()
            }
        }
    }
    // if (e.keyCode == 37 && selectableItems[selectItemsIdx].id == "difficultySlider" 
    //     || selectableItems[selectItemsIdx].id == "numberMoves") { //left and slider selected
    //     if(isSlider) {
    //       $(selectableItems[selectItemsIdx]).trigger('input')
    //     }
    //     isSlider = !isSlider; 
    // }
  });
})
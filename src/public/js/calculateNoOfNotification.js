function increaseNoOfNotification(selector) {
  let currentNoOfNotification = +$(`${selector}`).text();
  currentNoOfNotification++;

  $(`${selector}`).html(`${currentNoOfNotification}`).css("display", "block");
}

function decreaseNoOfNotification(selector) {
  let currentNoOfNotification = +$(`${selector}`).text();
  currentNoOfNotification--;

  if (currentNoOfNotification <= 0) {
    $(`${selector}`).css("display", "none").html("");
  } else {
    $(`${selector}`).html(`${currentNoOfNotification}`).css("display", "block");
  }
}

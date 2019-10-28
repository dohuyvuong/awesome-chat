function increaseNoOfNotification(selector) {
  let currentNoOfNotification = +$(`${selector}`).text();
  currentNoOfNotification++;

  $(`${selector}`).html(`${currentNoOfNotification}`).css("display", "block");
}

function decreaseNoOfNotification(selector, number) {
  let currentNoOfNotification = +$(`${selector}`).text();
  currentNoOfNotification -= number;

  if (currentNoOfNotification <= 0) {
    $(`${selector}`).css("display", "none").html("");
  } else {
    $(`${selector}`).html(`${currentNoOfNotification}`).css("display", "block");
  }
}

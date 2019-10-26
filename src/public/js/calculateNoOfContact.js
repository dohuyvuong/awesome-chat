function increaseNoOfContact(selector) {
  let currentNoOfContact = +$(`${selector} span`).text();
  currentNoOfContact++;

  $(`${selector}`).html(`(<span>${currentNoOfContact}</span>)`);
}

function decreaseNoOfContact(selector) {
  let currentNoOfContact = +$(`${selector} span`).text();
  currentNoOfContact--;

  if (currentNoOfContact <= 0) {
    $(`${selector}`).html("");
  } else {
    $(`${selector}`).html(`(<span>${currentNoOfContact}</span>)`);
  }
}

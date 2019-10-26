function increaseNoOfContact(className) {
  let currentNoContact = +$(`${className} span`).text();
  currentNoContact++;

  $(`${className}`).html(`(<span>${currentNoContact}</span>)`);
}

function decreaseNoOfContact(className) {
  let currentNoContact = +$(`${className} span`).text();
  currentNoContact--;

  if (currentNoContact === 0) {
    $(`${className}`).html("");
  } else {
    $(`${className}`).html(`(<span>${currentNoContact}</span>)`);
  }
}

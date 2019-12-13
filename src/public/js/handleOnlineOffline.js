$(document).ready(function () {
  socket.emit("get-conversations-online");
});

socket.on("response-conversations-online", function ({ conversationIds }) {
  conversationIds.forEach(conversationId => {
    $(`li.person[data-chat=${conversationId}]`).find(".dot").addClass("online");
    $(`li.person[data-chat=${conversationId}]`).find("img").addClass("avatar-online");
  });
});

socket.on("contact-online", function ({ conversationId }) {
  $(`li.person[data-chat=${conversationId}]`).find(".dot").addClass("online");
  $(`li.person[data-chat=${conversationId}]`).find("img").addClass("avatar-online");
});

socket.on("contact-offline", function ({ conversationId }) {
  $(`li.person[data-chat=${conversationId}]`).find(".dot").removeClass("online");
  $(`li.person[data-chat=${conversationId}]`).find("img").removeClass("avatar-online");
});

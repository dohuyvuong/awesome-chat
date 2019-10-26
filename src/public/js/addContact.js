function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let targetId = $(this).data("uid");

    $.post("/contact/add", { uid: targetId }, function (data) {
      if (data.result) {
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display", "inline-block");

        increaseNoOfContact(".count-request-contact-sent");
        // Xử lý realtime

        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}

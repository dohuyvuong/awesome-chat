function handleRejectReceivedRequestingContact() {
  $(".user-reject-received-requesting-contact").unbind("click").bind("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/reject-received-requesting-contact",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.result) {
          decreaseNoOfContact(".count-request-contact-received");
          decreaseNoOfNotification(".noti_contact_counter", 1);

          $("#request-contact-received ul.contactList").find(`li[data-uid=${targetId}]`).remove();

          displayAddActionAndRemoveOthers(targetId);

          if (!$("#request-contact-received ul.contactList").children().length) {
            $("#request-contact-received ul.contactList").html(`<div class="no-received-requesting-contacts">There are no received requesting contacts!</div>`);
          }

          socket.emit("reject-received-requesting-contact", { contactId: targetId });
        }
      },
    });
  });
}

socket.on("response-reject-received-requesting-contact", function (user) {
  decreaseNoOfContact(".count-request-contact-sent");

  $("#request-contact-sent ul.contactList").find(`li[data-uid=${user.id}]`).remove();

  displayAddActionAndRemoveOthers(user.id);

  if (!$("#request-contact-sent ul.contactList").children().length) {
    $("#request-contact-sent ul.contactList").html(`<div class="no-sent-requesting-contacts">There are no sent requesting contacts!</div>`);
  }
});

$(document).ready(function () {
  handleRejectReceivedRequestingContact(); // from js/handleRejectReceivedRequestingContact.js
});

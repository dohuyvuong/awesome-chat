function handleRemoveSentRequestingContact() {
  $(".user-remove-sent-requesting-contact").off("click").on("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/remove-sent-requesting-contact",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.result) {
          decreaseNoOfContact(".count-request-contact-sent");

          $("#request-contact-sent ul.contactList").find(`li[data-uid=${targetId}]`).remove();

          displayAddActionAndRemoveOthers(targetId);

          if (!$("#request-contact-sent ul.contactList").children().length) {
            $("#request-contact-sent ul.contactList").html(`<div class="no-sent-requesting-contacts">There are no sent requesting contacts!</div>`);
          }

          socket.emit("remove-sent-requesting-contact", { contactId: targetId });
        }
      },
    });
  });
}

socket.on("response-remove-sent-requesting-contact", function (user) {
  $(".noti_content").find(`div[data-uid=${user._id}]`)[0].remove();
  $(".list-notifications").find(`li>div[data-uid=${user._id}]`).parent()[0].remove();

  if (!$(".noti_content").children().length) {
    $(".noti_content").html(`<div class="no-notifications">There are no notifications!</div>`);
  }

  if (!$(".list-notifications").children().length) {
    $(".list-notifications").html(`<li><div class="no-notifications">There are no notifications!</div></li>`);
  }

  decreaseNoOfContact(".count-request-contact-received");
  decreaseNoOfNotification(".noti_contact_counter", 1);
  decreaseNoOfNotification(".noti_counter", 1);

  $("#request-contact-received ul.contactList").find(`li[data-uid=${user._id}]`).remove();

  displayAddActionAndRemoveOthers(user._id);

  if (!$("#request-contact-received ul.contactList").children().length) {
    $("#request-contact-received ul.contactList").html(`<div class="no-received-requesting-contacts">There are no received requesting contacts!</div>`);
  }
});

$(document).ready(function () {
  handleRemoveSentRequestingContact(); // from js/handleRemoveSentRequestingContact.js
});

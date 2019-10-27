function removeRequestingContact() {
  $(".user-remove-request-contact").bind("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/remove-request",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.result) {
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css("display", "inline-block");

          decreaseNoOfContact(".count-request-contact-sent");

          socket.emit("remove-requesting-contact", { contactId: targetId });
        }
      },
    });
  });
}

socket.on("response-remove-requesting-contact", function (user) {
  $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
  $(".list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove();

  if (!$(".noti_content").children().length) {
    $(".noti_content").html(`<div class="no-notifications">There are no notifications!</div>`);
  }

  if (!$(".list-notifications").children().length) {
    $(".list-notifications").html(`<li><div class="no-notifications">There are no notifications!</div><li>`);
  }

  decreaseNoOfContact(".count-request-contact-received");
  decreaseNoOfNotification(".noti_contact_counter");
  decreaseNoOfNotification(".noti_counter");
});

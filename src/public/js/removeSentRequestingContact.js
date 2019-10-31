function removeSentRequestingContact() {
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

          $("#request-contact-sent ul.contactList").find(`li[data-uid=${targetId}]`).remove();
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
  $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
  $(".list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove();

  console.log($(".list-notifications").find(`li>div[data-uid=${user.id}]`).parent());
  console.log($(".list-notifications").html());

  if (!$(".noti_content").children().length) {
    $(".noti_content").html(`<div class="no-notifications">There are no notifications!</div>`);
  }

  if (!$(".list-notifications").children().length) {
    $(".list-notifications").html(`<li><div class="no-notifications">There are no notifications!</div></li>`);
  }

  decreaseNoOfContact(".count-request-contact-received");
  decreaseNoOfNotification(".noti_contact_counter", 1);
  decreaseNoOfNotification(".noti_counter", 1);

  $("#request-contact-received ul.contactList").find(`li[data-uid=${user.id}]`).remove();
  if (!$("#request-contact-received ul.contactList").children().length) {
    $("#request-contact-received ul.contactList").html(`<div class="no-received-requesting-contacts">There are no received requesting contacts!</div>`);
  }
});

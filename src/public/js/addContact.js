function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let targetId = $(this).data("uid");

    $.post("/contact/add", { uid: targetId }, function (data) {
      if (data.result) {
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display", "inline-block");

        increaseNoOfContact(".count-request-contact-sent");

        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}

socket.on("response-add-new-contact", function (user) {
  let notification = `<span data-uid="${user.id}" class="noti-read-false">
                        <img class="avatar-small" src="images/users/${user.avatar}" alt="">
                        <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                      </span>`;

  $(".no-notifications").remove();
  $(".noti_content").prepend(notification);

  increaseNoOfContact(".count-request-contact-received");
  increaseNoOfNotification(".noti_contact_counter");
  increaseNoOfNotification(".noti_counter");
});

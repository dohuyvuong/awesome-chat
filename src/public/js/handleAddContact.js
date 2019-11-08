function handleAddContact() {
  $(".user-add-new-contact").unbind("click").bind("click", function () {
    let targetId = $(this).data("uid");

    $.post("/contact/add", { uid: targetId }, function (data) {
      if (data.result) {
        increaseNoOfContact(".count-request-contact-sent");

        let newSentRequestingContactElement = $("#find-user").find(`ul li[data-uid=${targetId}]`).get(0).outerHTML;
        $("#request-contact-sent .no-sent-requesting-contacts").remove();
        $("#request-contact-sent ul.contactList").prepend(newSentRequestingContactElement);

        displayCancelActionAndRemoveOthers(targetId);

        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}

socket.on("response-add-new-contact", function (user) {
  let notification = `<div data-uid="${user._id}" class="noti-read-false">
                        <img class="avatar-small" src="images/users/${user.avatar}" alt="">
                        <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                      </div>`;

  $(".noti_content .no-notifications").remove();
  $(".noti_content").prepend(notification);
  $(".list-notifications .no-notifications").parent().remove();
  $(".list-notifications").prepend(`<li>${notification}</li>`);

  increaseNoOfContact(".count-request-contact-received");
  increaseNoOfNotification(".noti_contact_counter");
  increaseNoOfNotification(".noti_counter");

  let newReceivedRequestingContactElement = `<li class="_contactList" data-uid="${user._id}">
                                                <div class="contactPanel">
                                                    <div class="user-avatar">
                                                        <img src="images/users/${user.avatar}" alt="">
                                                    </div>
                                                    <div class="user-name">
                                                        <p>
                                                            ${user.username}
                                                        </p>
                                                    </div>
                                                    <br>
                                                    <div class="user-address">
                                                        <span>${user.address ? user.address : ""}</span>
                                                    </div>
                                                    <div class="user-accept-received-requesting-contact" data-uid="${user._id}">
                                                        Chấp nhận
                                                    </div>
                                                    <div class="user-reject-received-requesting-contact action-danger" data-uid="${user._id}">
                                                        Xóa yêu cầu
                                                    </div>
                                                </div>
                                            </li>`;
  $("#request-contact-received ul.contactList .no-received-requesting-contacts").remove();
  $("#request-contact-received ul.contactList").prepend(newReceivedRequestingContactElement);

  displayAcceptAndRejectActionsAndRemoveOthers(user._id);
});

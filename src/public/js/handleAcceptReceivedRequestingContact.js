function handleAcceptReceivedRequestingContact() {
  $(".user-accept-received-requesting-contact").bind("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/accept-received-requesting-contact",
      type: "put",
      data: { uid: targetId },
      success: function (data) {
        if (data.result) {
          decreaseNoOfContact(".count-request-contact-received");
          decreaseNoOfNotification(".noti_contact_counter", 1);

          let targetElement = $("#request-contact-received ul.contactList").find(`li[data-uid=${targetId}]`);
          $(targetElement).find("div.user-accept-received-requesting-contact").remove();
          $(targetElement).find("div.user-reject-received-requesting-contact").remove();
          $(targetElement).find("div.contactPanel").append(`<div class="user-talk" data-uid="${targetId}">
                                                                Trò chuyện
                                                            </div>
                                                            <div class="user-remove-contact action-danger" data-uid="${targetId}">
                                                                Xóa liên hệ
                                                            </div>`);
          $("#contacts ul.contactList").find(".no-contacts").remove();
          $("#contacts ul.contactList").prepend(targetElement);

          // handle chat
          // handle remove contact
          handleRemoveContact();

          increaseNoOfContact(".count-contacts");

          // $("#request-contact-received ul.contactList").find(`li[data-uid=${targetId}]`).remove();
          if (!$("#request-contact-received ul.contactList").children().length) {
            $("#request-contact-received ul.contactList").html(`<div class="no-received-requesting-contacts">There are no received requesting contacts!</div>`);
          }

          socket.emit("accept-received-requesting-contact", { contactId: targetId });
        }
      },
    });
  });
}

socket.on("response-accept-received-requesting-contact", function (user) {
  let notification = `<div data-uid="${user.id}" class="noti-read-false">
                        <img class="avatar-small" src="images/users/${user.avatar}" alt="">
                        <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
                      </div>`;

  $(".noti_content .no-notifications").remove();
  $(".noti_content").prepend(notification);
  $(".list-notifications .no-notifications").parent().remove();
  $(".list-notifications").prepend(`<li>${notification}</li>`);

  increaseNoOfContact(".count-contacts");
  decreaseNoOfNotification(".noti_contact_counter", 1);
  increaseNoOfNotification(".noti_counter");

  $("#find-user ul.contactList").find(`li[data-uid=${user.id}]`).remove();

  $("#request-contact-sent ul.contactList").find(`li[data-uid=${user.id}]`).remove();
  decreaseNoOfContact(".count-request-contact-sent");

  let newContactElement = `
      <li class="_contactList" data-uid="${user.id}">
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
                <span>${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
      </li>
  `;
  $("#contacts ul.contactList").find(".no-contacts").remove();
  $("#contacts ul.contactList").prepend(newContactElement);
  handleRemoveContact();

  $("#request-contact-sent ul.contactList").find(`li[data-uid=${user.id}]`).remove();
  if (!$("#request-contact-sent ul.contactList").children().length) {
    $("#request-contact-sent ul.contactList").html(`<div class="no-sent-requesting-contacts">There are no sent requesting contacts!</div>`);
  }
});

$(document).ready(function () {
  handleAcceptReceivedRequestingContact(); // from js/handleAcceptReceivedRequestingContact.js
});

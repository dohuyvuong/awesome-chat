$(document).ready(function () {
  $("#link-read-more-received-req-contacts").click(function () {
    let offset = 0;
    if (!$("#request-contact-received .contactList").find(".no-received-requesting-contacts").length) {
      offset = $("#request-contact-received .contactList").find("li").length;
    }

    $(".read-more-received-req-contacts").hide();
    $(".read-more-received-req-contacts-loader").show();

    $.get(`/contact/get-received-requesting-contacts-as-users?offset=${offset}`, function (contactsAsUsers) {
      $(".read-more-received-req-contacts-loader").hide();

      if (!contactsAsUsers.length) {
        alertify.notify("Tất cả liên hệ yêu cầu kết bạn đã được hiển thị!", "success", 5);
        return;
      }

      contactsAsUsers.forEach(user => {
        $("#request-contact-received .no-received-requesting-contacts").remove();

        let userElement = `<li class="_contactList" data-uid="${user._id}">
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
        $("#request-contact-received ul.contactList").append(userElement);
      });
      handleRejectReceivedRequestingContact();
      handleAcceptReceivedRequestingContact();

      $(".read-more-received-req-contacts").show();
    });
  });
});

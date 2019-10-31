$(document).ready(function () {
  $("#link-read-more-sent-req-contacts").click(function () {
    let offset = 0;
    if (!$("#request-contact-sent .contactList").find(".no-sent-requesting-contacts").length) {
      offset = $("#request-contact-sent .contactList").find("li").length;
    }

    $(".read-more-sent-req-contacts").hide();
    $(".read-more-sent-req-contacts-loader").show();

    $.get(`/contact/get-sent-requesting-contacts-as-users?offset=${offset}`, function (contactsAsUsers) {
      $(".read-more-sent-req-contacts-loader").hide();

      if (!contactsAsUsers.length) {
        alertify.notify("Tất cả liên hệ chờ xác nhận đã được hiển thị!", "success", 5);
        return;
      }

      contactsAsUsers.forEach(user => {
        $("#request-contact-sent .no-sent-requesting-contacts").remove();

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
                                  <div class="user-remove-request-sent action-danger" data-uid="${user._id}">
                                      Hủy yêu cầu
                                  </div>
                              </div>
                          </li>`;
        $("#request-contact-sent ul.contactList").append(userElement);
      });

      $(".read-more-sent-req-contacts").show();
    });
  });
});

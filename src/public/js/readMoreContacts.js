$(document).ready(function () {
  $("#link-read-more-contacts").click(function () {
    let offset = 0;
    if (!$("#contacts .contactList").find(".no-contacts").length) {
      offset = $("#contacts .contactList").find("li").length;
    }

    $(".read-more-contacts").hide();
    $(".read-more-contacts-loader").show();

    $.get(`/contact/get-contacts-as-users?offset=${offset}`, function (contactsAsUsers) {
      $(".read-more-contacts-loader").hide();

      if (!contactsAsUsers.length) {
        alertify.notify("Tất cả liên hệ đã được hiển thị!", "success", 5);
        return;
      }

      $("#contacts .no-contacts").remove();

      contactsAsUsers.forEach(user => {
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
                                  <div class="user-talk" data-uid="${user._id}">
                                      Trò chuyện
                                  </div>
                                  <div class="user-remove-contact action-danger" data-uid="${user._id}">
                                      Xóa liên hệ
                                  </div>
                              </div>
                          </li>`;
        $("#contacts ul.contactList").append(userElement);
      });
      handleRemoveContact();

      $(".read-more-contacts").show();
    });
  });
});

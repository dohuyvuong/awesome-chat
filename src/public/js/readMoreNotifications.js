$(document).ready(function () {
  $("#link-read-more-notifications").click(function () {
    let offset = 0;
    if (!$("#notificationsModal .list-notifications").find("li>#no-notifications").length) {
      offset = $("#notificationsModal .list-notifications").find("li").length;
    }

    $(".read-more-notifications").hide();
    $(".read-more-notifications-loader").show();

    $.get(`/notification?offset=${offset}`, function (notifications) {
      $(".read-more-notifications-loader").hide();

      if (!notifications.length) {
        alertify.notify("Tất cả thông báo đã được hiển thị!", "success", 5);
        return;
      }

      notifications.forEach(notification => {
        $(".list-notifications .no-notifications").parent().remove();
        $(".list-notifications").append(`<li>${notification}</li>`);
      });

      $(".read-more-notifications").show();
    });
  });
});

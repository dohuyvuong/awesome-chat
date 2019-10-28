function markNotificationsAsRead(targetUserIds) {
  $.ajax({
    url: "/notification/mark-notifications-as-read",
    type: "put",
    data: { targetUserIds },
    success: function (result) {
      if (result) {
        targetUserIds.forEach(function (uid) {
          $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("noti-read-false").addClass("noti-read-true");
          $(".list-notifications").find(`div[data-uid=${uid}]`).removeClass("noti-read-false").addClass("noti-read-true");
        });
        decreaseNoOfNotification(".noti_counter", targetUserIds.length);
      }
    },
  });
}

$(document).ready(function () {
  $("#popup-mark-notifications-as-read").bind("click", function () {
    let targetUserIds = [];

    $(".noti_content").find(".noti-read-false").each(function (index, notification) {
      targetUserIds.push($(notification).data("uid"));
    });

    if (!targetUserIds.length) {
      alertify.notify("Tất cả các thông báo trên màn hình đã được đánh dấu là đã đọc. Bấm xem tất cả để xem thêm thông báo!", "warning", 5);
      return;
    }

    markNotificationsAsRead(targetUserIds);
  });

  $("#modal-mark-notifications-as-read").bind("click", function () {
    let targetUserIds = [];

    $(".list-notifications").find(".noti-read-false").each(function (index, notification) {
      targetUserIds.push($(notification).data("uid"));
    });

    if (!targetUserIds.length) {
      alertify.notify("Tất cả các thông báo trên màn hình đã được đánh dấu là đã đọc. Bấm xem thêm để tải thêm thông báo!", "warning", 5);
      return;
    }

    markNotificationsAsRead(targetUserIds);
  });
});

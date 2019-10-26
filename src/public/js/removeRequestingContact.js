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
        }
      },
    });
  });
}
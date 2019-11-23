function handleRemoveContact() {
  $(".user-remove-contact").off("click").on("click", function () {
    let targetId = $(this).data("uid");
    let username = $(this).parent().find("div.user-name p").text();

    Swal.fire({
      title: `Bạn có chắc chắn muốn xoá ${username} khỏi danh bạ không?`,
      text: "Bạn không thể hoàn tác quá trình này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ"
    }).then((result) => {
      if (!result.value) {
        return false;
      }

      $.ajax({
        url: "/contact/remove-contact",
        type: "delete",
        data: { uid: targetId },
        success: function (data) {
          if (data.result) {
            decreaseNoOfContact(".count-contacts");

            $("#contacts ul.contactList").find(`li[data-uid=${targetId}]`).remove();

            displayAddActionAndRemoveOthers(targetId);

            if (!$("#contacts ul.contactList").children().length) {
              $("#contacts ul.contactList").html(`<div class="no-contacts">There are no contacts!</div>`);
            }

            socket.emit("remove-contact", { contactId: targetId });
          }
        },
      });
    });
  });
}

socket.on("response-remove-contact", function (user) {
  decreaseNoOfContact(".count-contacts");

  $("#contacts ul.contactList").find(`li[data-uid=${user._id}]`).remove();

  displayAddActionAndRemoveOthers(user._id);

  if (!$("#contacts ul.contactList").children().length) {
    $("#contacts ul.contactList").html(`<div class="no-contacts">There are no contacts!</div>`);
  }
});

$(document).ready(function () {
  handleRemoveContact(); // from js/handleRemoveContact.js
});

function findUsersToAddContact(element) {
  if (element.which === 13 || element.type === "click") {
    $("#find-user .contactList").html("");

    let keyword = $("#inp-search-new-contact").val().trim();
    let keywordRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ @.-]+$/);

    $("#inp-search-new-contact").val(keyword);

    if (keyword.length < 2) {
      alertify.notify("Từ khoá tìm kiếm có độ dài từ 2 đến 30 kí tự!", "error", 5);
      return;
    }

    if (!keywordRegex.test(keyword)) {
      alertify.notify("Từ khoá tìm kiếm không được chứa kí tự đặc biệt ngoại trừ @ . -", "error", 5);
      return;
    }

    $.get(`/contact/search?keyword=${keyword}`, function (data) {
      $("#find-user .contactList").html(data);
      addContact(); // from js/addContact.js
      removeRequestingContact(); // from js/removeRequestingContact.js
    });
  }
}

$(document).ready(function () {
  $("#inp-search-new-contact").bind("keypress", findUsersToAddContact);
  $("#btn-search-new-contact").bind("click", findUsersToAddContact);
});

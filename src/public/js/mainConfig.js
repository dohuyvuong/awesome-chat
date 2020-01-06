const socket = io();

function nineScrollLeft() {
  $(".left").niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: "#ECECEC",
    cursorwidth: "7px",
    scrollspeed: 50
  });
}

function nineScrollRight(conversationId) {
  $(`.right .chat[data-chat=${conversationId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: "#ECECEC",
    cursorwidth: "7px",
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${conversationId}]`).scrollTop($(`.right .chat[data-chat=${conversationId}]`)[0].scrollHeight);
}

function enableEmojioneArea(conversationId) {
  $(`#write-chat-${conversationId}`).emojioneArea({
    standalone: false,
    pickerPosition: "top",
    filtersPosition: "bottom",
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $(`#write-chat-${conversationId}`).val(this.getText());
      },
      focus: function () {
        handleChatText(conversationId);
      }
    },
  });
  $(".icon-chat").on("click", function(event) {
    event.preventDefault();
    $(".emojionearea-button").click();
    $(".emojionearea-editor").focus();
  });
}

function spinLoaded() {
  $("#loader").css("display", "none");
}

function spinLoading() {
  $("#loader").css("display", "block");
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $("#show-modal-contacts").click(function() {
    $(this).find(".noti_contact_counter").fadeOut("slow");
  });
}

function configNotification() {
  $("#noti_Button").click(function() {
    $("#notifications").fadeToggle("fast", "linear");
    $(".noti_counter").fadeOut("slow");
    return false;
  });
  // $(document).click(function() {
  //   $("#notifications").fadeOut("fast", "linear");
  // });
  window.onclick = function (event) {
    notificationContainer = $("#noti_Container");
    if (!notificationContainer.is(event.target) && notificationContainer.has(event.target).length === 0) {
      $("#notifications").fadeOut("fast", "linear");
    }
  }
}

function gridPhotos(layoutNumber) {
  $(".show-images").off("click").on("click", function () {
    let imageModalId = $(this).attr("href");

    let allImages = $(`${imageModalId}`).find(".modal-body").html();

    let countRows = Math.ceil($(`${imageModalId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`${imageModalId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`${imageModalId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`${imageModalId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    $(`${imageModalId}`).on("hidden.bs.modal", function () {
      $(this).find(".modal-body").html(allImages);
    });
  });
}

function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 5);
  }
}

function handleChangeTypeChat() {
  $("#select-type-chat").on("change", function () {
    let selectedOption = $("option:selected", this);
    selectedOption.tab("show");

    if ($(this).val() === "personal-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  });
}

function handleChangeScreenChat() {
  $(".room-chat").off("click").on("click", function () {
    let conversationId = $(this).find("li").data("chat");

    $(".room-chat").find("li").removeClass("active");
    $(".room-chat").find(`li[data-chat=${conversationId}]`).addClass("active");

    $(this).tab("show");

    nineScrollRight($(this).find("li").data("chat"));

    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea($(this).find("li").data("chat"));
    handleChatImage(conversationId);
    handleChatAttachment(conversationId);
    handleVideoCall(conversationId);
  });
}

function convertEmoji() {
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    // use .shortnameToImage if only converting shortnames (for slightly better performance)
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash message ở màn hình master
  flashMasterNotify();

  // Lọc theo kiểu cuộc trò chuyện
  handleChangeTypeChat();

  // Thay đổi màn hình chat
  handleChangeScreenChat();

  // Show image emoji icon
  convertEmoji();

  let firstConversationElement = $("ul.people").find(".room-chat")[0];
  if (firstConversationElement) {
    firstConversationElement.click();
  }
});

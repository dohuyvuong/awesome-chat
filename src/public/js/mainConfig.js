const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(conversationId) {
  $(`.right .chat[data-chat=${conversationId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${conversationId}]`).scrollTop($(`.right .chat[data-chat=${conversationId}]`)[0].scrollHeight);
}

function enableEmojioneArea(chatId) {
  $('.write-chat[data-chat="' + chatId + '"]').emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $('.write-chat').val(this.getText());
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
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
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  // $(document).click(function() {
  //   $('#notifications').fadeOut('fast', 'linear');
  // });
  window.onclick = function (event) {
    notificationContainer = $("#noti_Container");
    if (!notificationContainer.is(event.target) && notificationContainer.has(event.target).length === 0) {
      $('#notifications').fadeOut('fast', 'linear');
    }
  }
}

function gridPhotos(layoutNumber) {
  let countRows = Math.ceil($('#imagesModal').find('div.all-images>img').length / layoutNumber);
  let layoutStr = new Array(countRows).fill(layoutNumber).join("");
  $('#imagesModal').find('div.all-images').photosetGrid({
    highresLinks: true,
    rel: 'withhearts-gallery',
    gutter: '2px',
    layout: layoutStr,
    onComplete: function() {
      $('.all-images').css({
        'visibility': 'visible'
      });
      $('.all-images a').colorbox({
        photo: true,
        scalePhotos: true,
        maxHeight: '90%',
        maxWidth: '90%'
      });
    }
  });
}

function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function() {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function(resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function(success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#cancel-group-chat').bind('click', function() {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function(index) {
        $(this).remove();
      });
    }
  });
}

function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 5);
  }
}

function handleChangeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let selectedOption = $("option:selected", this);
    selectedOption.tab("show");

    if ($(this).val() === 'personal-chat') {
      $('.create-group-chat').hide();
    } else {
      $('.create-group-chat').show();
    }
  });
}

function handleChangeScreenChat() {
  $(".room-chat").unbind("click").bind("click", function () {
    $(".room-chat").find("li").removeClass("active");
    $(this).find("li").addClass("active");

    $(this).tab("show");

    nineScrollRight($(this).find("li").data("chat"));
  });
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
  enableEmojioneArea("17071995");

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
  addFriendsToGroup();

  // Action hủy việc tạo nhóm trò chuyện
  cancelCreateGroup();

  // Flash message ở màn hình master
  flashMasterNotify();

  // Lọc theo kiểu cuộc trò chuyện
  handleChangeTypeChat();

  // Thay đổi màn hình chat
  handleChangeScreenChat();

  let firstConversationElement = $("ul.people").find(".room-chat")[0];
  if (firstConversationElement) {
    firstConversationElement.click();
  }
});

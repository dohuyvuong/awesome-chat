function displayAddActionAndRemoveOthers(targetId) {
  removeAllAction(targetId);

  // Add find-user-tab
  let findUserTargetElement = $("#find-user ul.contactList").find(`li[data-uid=${targetId}]`);
  findUserTargetElement.find(".contactPanel").append(`
    <div class="user-add-new-contact" data-uid="${targetId}">
      Thêm vào danh sách liên lạc
    </div>
  `);

  handleAddContact();
}

function displayChatAndRemoveActionsAndRemoveOthers(targetId) {
  removeAllAction(targetId);

  let chatAndRemoveActionsHtml = `
    <div class="user-talk" data-uid="${targetId}">
        Trò chuyện
    </div>
    <div class="user-remove-contact action-danger" data-uid="${targetId}">
        Xóa liên hệ
    </div>
  `;

  // Add find-user-tab
  let findUserTargetElement = $("#find-user ul.contactList").find(`li[data-uid=${targetId}]`);
  findUserTargetElement.find(".contactPanel").append(chatAndRemoveActionsHtml);

  // Add contacts-tab
  let contactsTargetElement = $("#contacts ul.contactList").find(`li[data-uid=${targetId}]`);
  contactsTargetElement.find(".contactPanel").append(chatAndRemoveActionsHtml);

  handleRemoveContact();
}

function displayCancelActionAndRemoveOthers(targetId) {
  removeAllAction(targetId);

  let cancelActionHtml = `
    <div class="user-remove-sent-requesting-contact action-danger" data-uid="${targetId}">
      Hủy yêu cầu
    </div>
  `;

  // Add find-user-tab
  let findUserTargetElement = $("#find-user ul.contactList").find(`li[data-uid=${targetId}]`);
  findUserTargetElement.find(".contactPanel").append(cancelActionHtml);

  // Add request-contact-sent-tab
  let requestContactSentTargetElement = $("#request-contact-sent ul.contactList").find(`li[data-uid=${targetId}]`);
  requestContactSentTargetElement.find(".contactPanel").append(cancelActionHtml);

  handleRemoveSentRequestingContact();
}

function displayAcceptAndRejectActionsAndRemoveOthers(targetId) {
  removeAllAction(targetId);

  let acceptAndRejectActionsHtml = `
    <div class="user-accept-received-requesting-contact" data-uid="${targetId}">
      Chấp nhận
    </div>
    <div class="user-reject-received-requesting-contact action-danger" data-uid="${targetId}">
      Xóa yêu cầu
    </div>
  `;

  // Add find-user-tab
  let findUserTargetElement = $("#find-user ul.contactList").find(`li[data-uid=${targetId}]`);
  findUserTargetElement.find(".contactPanel").append(acceptAndRejectActionsHtml);

  // Add request-contact-received-tab
  let requestContactReceivedTargetElement = $("#request-contact-received ul.contactList").find(`li[data-uid=${targetId}]`);
  requestContactReceivedTargetElement.find(".contactPanel").append(acceptAndRejectActionsHtml);

  handleAcceptReceivedRequestingContact();
  handleRejectReceivedRequestingContact();
}

function removeAllAction(targetId) {
  // Remove all actions from target element
  let targetElement = $("#contactsModal").find(`li[data-uid=${targetId}]`);
  targetElement.find("div.user-add-new-contact").remove();
  targetElement.find("div.user-talk").remove();
  targetElement.find("div.user-remove-contact").remove();
  targetElement.find("div.user-remove-sent-requesting-contact").remove();
  targetElement.find("div.user-accept-received-requesting-contact").remove();
  targetElement.find("div.user-reject-received-requesting-contact").remove();
}

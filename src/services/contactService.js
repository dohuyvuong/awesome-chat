import { UserModel, ContactModel, NotificationModel } from "../models";
import { NOTIFICATION_TYPES } from "../models/notificationModel";
import _ from "lodash";
import logger from "winston";

/**
 * Search users to add new contact
 * @param {String} keyword Keyword to search new contact
 * @param {String} currentUserId Current user id
 */
let searchNewContact = async (keyword, currentUserId) => {
  logger.debug("Search new contact with keyword=%s, currentUserId=%s", keyword, currentUserId);

  let exceptedUserIds = [currentUserId];

  let contacts = await ContactModel.findByUserId(currentUserId);
  contacts.map(contact => {
    exceptedUserIds.push(contact.userId);
    exceptedUserIds.push(contact.contactId);
  });
  exceptedUserIds = _.uniq(exceptedUserIds);

  let users = await UserModel.findByKeywordAndExceptedIds(keyword, exceptedUserIds);

  return users;
};

/**
 * Add new contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let addNewContact = async (currentUserId, contactId) => {
  logger.debug("Add new contact with currentUserId=%s, contactId=%s", currentUserId, contactId);

  let existingContact = await ContactModel.findContact(currentUserId, contactId);
  if (existingContact) {
    return false;
  }

  // Create new contact
  let contactItem = {
    userId: currentUserId,
    contactId: contactId,
  };
  let newContact = await ContactModel.createNew(contactItem);

  // Create new notification
  let notificationItem = {
    senderId: currentUserId,
    receiverId: contactId,
    type: NOTIFICATION_TYPES.ADD_CONTACT,
  };
  await NotificationModel.createNew(notificationItem);

  return newContact ? true : false;
};

/**
 * Remove sent requesting contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let removeSentRequestingContact = async (currentUserId, contactId) => {
  logger.debug("Remove sent requsting contact with currentUserId=%s, contactId=%s", currentUserId, contactId);

  let result = await ContactModel.removeSentRequestingContact(currentUserId, contactId);
  if (result.n === 0) {
    return false;
  }

  await NotificationModel.removeSentRequestingContactNotification(currentUserId, contactId);

  return true;
};

/**
 * Reject received requesting contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let rejectReceivedRequestingContact = async (currentUserId, contactId) => {
  logger.debug("Reject received requesting contact with currentUserId=%s, contactId=%s", currentUserId, contactId);

  let result = await ContactModel.rejectReceivedRequestingContact(currentUserId, contactId);

  return result.n > 0;
};

/**
 * Accept received requesting contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let acceptReceivedRequestingContact = async (currentUserId, contactId) => {
  logger.debug("Accept received requesting contact with currentUserId=%s, contactId=%s", currentUserId, contactId);

  let result = await ContactModel.acceptReceivedRequestingContact(currentUserId, contactId);

  // Create new notification
  let notificationItem = {
    senderId: currentUserId,
    receiverId: contactId,
    type: NOTIFICATION_TYPES.ACCEPT_CONTACT,
  };
  await NotificationModel.createNew(notificationItem);

  return result.nModified > 0;
};

/**
 * Remove contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let removeContact = async (currentUserId, contactId) => {
  logger.debug("Remove contact with currentUserId=%s, contactId=%s", currentUserId, contactId);

  let result = await ContactModel.removeContact(currentUserId, contactId);

  return result.n > 0;
};

/**
 * Get contacts as users default 10 records
 * @param {String} currentUserId Current user id
 * @param {Number} offset Offset default 0
 * @param {Number} limit Limit default 10
 */
let getContactsAsUsers = async (currentUserId, offset = 0, limit = 10) => {
  logger.debug("Get contacts as users with currentUserId=%s, offset=%s, limit=%s", currentUserId, offset, limit);

  let contacts = await ContactModel.getContacts(currentUserId, offset, limit);

  return Promise.all(contacts.map(async (contact) => {
    if (contact.userId == currentUserId) {
      return await UserModel.findUserById(contact.contactId);
    }
    if (contact.contactId == currentUserId) {
      return await UserModel.findUserById(contact.userId);
    }
  }));
};

/**
 * Get number of contacts
 * * @param {String} currentUserId Current user id
 */
let getNoOfContacts = async (currentUserId) => {
  logger.debug("Get number of contacts with currentUserId=%s", currentUserId);

  return await ContactModel.getNoOfContacts(currentUserId);
};

/**
 * Get sent requesting contacts as users default 10 records
 * @param {String} currentUserId Current user id
 * @param {Number} offset Offset default 0
 * @param {Number} limit Limit default 10
 */
let getSentRequestingContactsAsUsers = async (currentUserId, offset = 0, limit = 10) => {
  logger.debug("Get sent requesting contacts as users with currentUserId=%s, offset=%s, limit=%s", currentUserId, offset, limit);

  let sentRequestingContacts = await ContactModel.getSentRequestingContacts(currentUserId, offset, limit);

  return Promise.all(sentRequestingContacts.map(async (contact) => {
    return await UserModel.findUserById(contact.contactId);
  }));
};

/**
 * Get number of sent requesting contacts
 * * @param {String} currentUserId Current user id
 */
let getNoOfSentRequestingContacts = async (currentUserId) => {
  logger.debug("Get number of sent requesting contacts with currentUserId=%s", currentUserId);

  return await ContactModel.getNoOfSentRequestingContacts(currentUserId);
};

/**
 * Get received requesting contacts as users default 10 records
 * @param {String} currentUserId Current user id
 * @param {Number} offset Offset default 0
 * @param {Number} limit Limit default 10
 */
let getReceivedRequestingContactsAsUsers = async (currentUserId, offset = 0, limit = 10) => {
  logger.debug("Get received requesting contacts as users with currentUserId=%s, offset=%s, limit=%s", currentUserId, offset, limit);

  let receivedRequestingContacts = await ContactModel.getReceivedRequestingContacts(currentUserId, offset, limit);

  return Promise.all(receivedRequestingContacts.map(async (contact) => {
    return await UserModel.findUserById(contact.userId);
  }));
};

/**
 * Get number of received requesting contacts
 * * @param {String} currentUserId Current user id
 */
let getNoOfReceivedRequestingContacts = async (currentUserId) => {
  logger.debug("Get number of received requesting contacts with currentUserId=%s", currentUserId);

  return await ContactModel.getNoOfReceivedRequestingContacts(currentUserId);
};

/**
 * Find users to add to new group chat
 * @param {String} keyword Keyword to find users to add to new group chat
 * @param {String} currentUserId Current user id
 */
let findContact = async (keyword, currentUserId) => {
  logger.debug("Find contact with keyword=%s, currentUserId=%s", keyword, currentUserId);

  let userIds = [currentUserId];

  let contacts = await ContactModel.findByUserId(currentUserId);
  contacts.map(contact => {
    userIds.push(contact.userId);
    userIds.push(contact.contactId);
  });
  userIds = _.uniq(userIds);
  userIds = userIds.filter(userId => userId != currentUserId);

  let users = await UserModel.findByKeywordAndIds(keyword, userIds);

  return users;
};

export const contactService = {
  searchNewContact,
  addNewContact,
  removeSentRequestingContact,
  rejectReceivedRequestingContact,
  acceptReceivedRequestingContact,
  removeContact,
  getContactsAsUsers,
  getNoOfContacts,
  getSentRequestingContactsAsUsers,
  getNoOfSentRequestingContacts,
  getReceivedRequestingContactsAsUsers,
  getNoOfReceivedRequestingContacts,
  findContact,
};

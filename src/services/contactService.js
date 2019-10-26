import { UserModel, ContactModel } from "../models";
import _ from "lodash";

/**
 * Search users to add new contact
 * @param {String} keyword Keyword to search new contact
 * @param {String} currentUserId Current user id
 */
let searchNewContact = async (keyword, currentUserId) => {
  let exceptedUserIds = [currentUserId];

  let contacts = await ContactModel.findByUserId(currentUserId);
  contacts.map(contact => {
    exceptedUserIds.push(contact.userId);
    exceptedUserIds.push(contact.contactId);
  });
  exceptedUserIds = _.uniq(exceptedUserIds);

  let users = await UserModel.findExceptedById(keyword, exceptedUserIds);

  return users;
}

/**
 * Add new contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let addNewContact = async (currentUserId, contactId) => {
  let existingContact = await ContactModel.findContact(currentUserId, contactId);
  if (existingContact) {
    return false;
  }

  let newContact = {
    userId: currentUserId,
    contactId: contactId,
  };

  return await ContactModel.createNew(newContact);
}

/**
 * Remove requesting contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let removeRequestingContact = async (currentUserId, contactId) => {
  return (await ContactModel.removeRequestingContact(currentUserId, contactId)).n > 0;
}

export const contactService = {
  searchNewContact,
  addNewContact,
  removeRequestingContact,
};

import { UserModel, ContactModel } from "../models";
import _ from "lodash";

/**
 * Search users to add new contact
 * @param {String} keyword Keyword to search new contact
 * @param {String} currentUserId Current user id
 */
let searchNewContact = async (keyword, currentUserId) => {
  let exceptedUserIds = [];

  let contacts = await ContactModel.findByUserId(currentUserId);
  contacts.map(contact => {
    exceptedUserIds.push(contact.userId);
    exceptedUserIds.push(contact.contactId);
  });
  exceptedUserIds = _.uniq(exceptedUserIds);

  let users = await UserModel.findExceptedById(keyword, exceptedUserIds);

  return users;
}

export const contactService = {
  searchNewContact,
};

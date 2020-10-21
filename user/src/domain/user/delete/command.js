import {countUsers} from '../repository';
import UserError from '../error';

/**
 * The command for deleting the users
 */
export default class DeleteUserCommand {
  /**
   * Validate this command
   *
   * @throws UserError - if the get user command is invalid
   */
  async validate(dB) {
    const errors = [];

    if (this.id || this.id === 0) {
      this.id = parseInt(this.id, 10);
    }

    if (!this.id) {
      errors.push({field: 'id', message: global.__getDictionary('__ERROR_USER_NOT_FOUND__')});
    }

    const userExist = await countUsers.bind(dB)(this.id);
    if (!userExist) {
      errors.push({field: 'id', message: global.__getDictionary('__ERROR_USER_NOT_FOUND__')});
    }

    if (errors.length > 0) {
      console.log(errors);
      throw new UserError(
        this,
        422,
        errors,
        global.__getDictionary('__DELETE_USER_VALIDATION_FAILED__')
      );
    }
  }

  /**
   * Build a DeleteUser out of the given JSON payload
   *
   * @param {object} json - the JSON to build from
   * @returns a new DeleteUser instance
   */
  static buildFromJSON({id}) {
    const deleteUser = new DeleteUserCommand();
    deleteUser.id = parseInt(id, 10);
    return deleteUser;
  }
}

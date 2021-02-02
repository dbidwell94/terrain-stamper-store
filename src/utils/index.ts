import { IUserMinimum } from "../models/user";
import { CONNECTION } from "../index";
import UserServices from "../services/userServices";
import { validRoles } from "../models/roles";

export const SECRET = process.env.SECRET || "secret";

/**
 * Checks to make sure privileges are valid before a CRUD operation is performed on a user
 * @param options queryUser: the user with whom the query is running on. idToCheck: the id from the jwt. userService: the current UserService
 */
export async function checkPrivileges(options: {
  tokenId: number;
  paramId: number;
  userService: UserServices;
}): Promise<boolean> {
  const { tokenId, paramId, userService } = options;

  const userToCheck = await userService.getFullUserInfoById(tokenId);
  const adminRole = userToCheck.roles?.find((role) => role.roleName === validRoles.ADMIN);
  return adminRole !== undefined || adminRole !== null || paramId === tokenId;
}

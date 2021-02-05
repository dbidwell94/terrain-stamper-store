import UserServices from "../services/userServices";
import { validRoles } from "../models/role";
import unzip from "unzipper";
import fs from "fs";
import path from "path";

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
  const adminRole = userToCheck.roles.find((role) => role.roleName === validRoles.ADMIN);
  return adminRole !== undefined || adminRole !== null || paramId === tokenId;
}

interface IExtractOptions {
  target: string;
  deleteOriginal?: boolean;
}

/**
 * Extracts a file to a directory and deletes zip file (optional)
 * @param param0.to The base directory of where to extract the file
 * @param param0.target The location of the zip file to extract
 * @param param0.deleteOriginal Should the original zip file be automatically deleted
 * @returns The directory in which the files were extracted
 */
export async function extractFile({ target, deleteOriginal = false }: IExtractOptions): Promise<string> {
  const ogFile = fs.createReadStream(target);

  const parentDir = path.dirname(target);

  await ogFile.pipe(unzip.Extract({ path: parentDir })).promise();

  if (deleteOriginal) {
    fs.rmSync(target);
  }

  await Promise.resolve(
    fs.readdirSync(parentDir).forEach(async (folder) => {
      fs.readdirSync(path.join(parentDir, folder)).forEach((file) => {
        fs.renameSync(path.join(parentDir, folder, file), path.join(parentDir, file));
      });
      fs.rmdirSync(path.join(parentDir, folder));
    })
  );

  return parentDir;
}

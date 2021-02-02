import { getRepository } from "typeorm";
import User from "../models/user";

export default getRepository(User, "default");

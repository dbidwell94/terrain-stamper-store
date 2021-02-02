import { Entity, Column, OneToMany } from "typeorm";
import Auditable from "./auditable";
import User from "./user";

export enum validRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  COMPANY_OWNER = "COMPANY_OWNER",
  COMPANY_ADMIN = "COMPANY_ADMIN",
}

@Entity()
export default class Role extends Auditable {
  @Column({ type: "varchar", unique: true, nullable: false })
  roleName: string;

  @OneToMany((type) => User, (user) => user.roles)
  users: User[];
}

import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import User from "./user";
import { IModel } from ".";

export enum validRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  COMPANY_OWNER = "COMPANY_OWNER",
  COMPANY_ADMIN = "COMPANY_ADMIN",
}

export type IRole = IAuditable & {
  roleName: string;
  users: User[];
};

export type IRoleMin = Omit<IRole, "users" | "createdAt" | "updatedAt">;

@Entity()
export default class Role extends Auditable implements IModel {
  @Column({ type: "varchar", unique: true, nullable: false })
  roleName: string;

  @ManyToMany(() => User, (user) => user.roles, {
    cascade: ["insert", "update"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  users: User[];
}

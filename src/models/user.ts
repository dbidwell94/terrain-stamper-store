import { Entity, Column, OneToMany, ManyToMany, JoinTable, AfterLoad } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Purchase from "./purchase";
import Role from "./role";
import { IModel } from ".";
import Stamp from "./stamp";

interface IUser extends IAuditable {
  username: string;
  password: string;
  email: string;
  taxId?: string;
  purchases: Purchase[];
  roles: Role[];
}

@Entity()
export default class User extends Auditable implements IModel {
  @Column({ type: "varchar", length: 25, nullable: false, unique: true })
  username: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", nullable: true, unique: true })
  taxId?: string;

  @OneToMany(() => Purchase, (purchase) => purchase.user, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
})
  purchases: Purchase[];

  @OneToMany(() => Stamp, (stamp) => stamp.uploadedUser, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  uploadedStamps: Stamp[];

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true
  })
  @JoinTable({ name: "userRoles" })
  roles: Role[];
}

export function getUserMinimum(user: User): IUserMinimum {
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    username: user.username,
    email: user.email,
    roles: user.roles
  };
}

export type IUserRegister = Omit<IUser, "purchases" | "createdAt" | "id" | "updatedAt">;
export type IUserMinimum = Omit<IUser, "password" | "purchases"> & IAuditable;
export type IUserUpdate = Omit<IUser, "purchases">;
export type IUserSave = Omit<IUserRegister, "roles"> & {
  roles: Promise<Role[]>;
};

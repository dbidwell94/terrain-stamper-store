import { Entity, Column, OneToMany, ManyToMany, JoinTable, AfterLoad } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Purchase from "./purchase";
import Role from "./role";
import { IModel } from ".";
import Stamp from "./stamp";

interface IUser {
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
    onUpdate: "CASCADE",
  })
  purchases: Promise<Purchase[]>;

  @OneToMany(() => Stamp, (stamp) => stamp.uploadedUser, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  uploadedStamps: Promise<Stamp[]>;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinTable()
  roles: Promise<Role[]>;
}

export async function getUserMinimum(user: User) {
  const roles = await Promise.resolve(user.roles);
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    username: user.username,
    email: user.email,
    roles,
  };
}

export type IUserRegister = Omit<IUser, "purchases">;
export type IUserMinimum = Omit<IUser, "password" | "purchases"> & IAuditable;
export type IUserUpdate = Omit<IUser, "purchases">;

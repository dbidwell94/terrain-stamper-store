import { Entity, Column, OneToMany } from "typeorm";
import Auditable, { IAuditable } from "models/auditable";
import Purchase from "models/purchase";
import Role from "models/role";

interface IUser {
  username: string;
  password: string;
  email: string;
  taxId?: string;
  purchases: Purchase[];
  roles: Role[];
}

@Entity()
export default class User extends Auditable {
  @Column({ type: "varchar", length: 25, nullable: false, unique: true })
  username: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", nullable: true, unique: true })
  taxId?: string;

  @OneToMany((type) => Purchase, (purchase) => purchase.user, { cascade: true })
  purchases: Purchase[];

  @OneToMany((type) => Role, (role) => role.users, { cascade: true })
  roles: Role[];
}

export type IUserRegister = Omit<IUser, "purchases" | "roles">;
export type IUserMinimum = Omit<IUser, "password"> & IAuditable;
export type IUserUpdate = Omit<IUser, "purchases">;

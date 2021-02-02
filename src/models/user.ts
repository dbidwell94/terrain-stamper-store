import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Auditable, { IAuditable, IAuditableMin } from "./auditable";
import Purchase from "./purchase";
import Role from "./roles";

interface IUser {
  username: string;
  password: string;
  email: string;
  taxId?: string;
  purchases: Purchase[];
  role: Role[];
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

  @OneToMany((type) => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @ManyToOne((type) => Role, (role) => role.users)
  role: Role[];
}

export type IUserRegister = Omit<IUser, "purchases" | "role">;
export type IUserMinimum = Omit<IUser, "password"> & IAuditable;

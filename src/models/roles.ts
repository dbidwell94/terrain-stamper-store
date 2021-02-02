import { Entity, Column, OneToMany } from "typeorm";
import Auditable from "./auditable";
import User from "./user";

@Entity()
export default class Role extends Auditable {
  @Column({ type: "varchar", unique: true, nullable: false })
  roleName: string;

  @OneToMany((type) => User, (user) => user.role)
  users: User[];
}

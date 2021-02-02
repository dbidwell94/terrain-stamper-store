import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Auditable from "./auditable";
import Purchase from "./purchase";
import Role from "./roles";

@Entity()
export default class User extends Auditable {
  @Column({ type: "varchar", length: 25, nullable: false, unique: true })
  username: string;

  @Column({ type: "varchar", length: 32, nullable: false })
  password: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  taxId: string;

  @OneToMany(type => Purchase, purchase => purchase.user)
  purchases: Purchase[]

  @ManyToOne((type) => Role, (role) => role.users)
  role: Role[];
}

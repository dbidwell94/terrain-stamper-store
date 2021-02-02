import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import Auditable from "./auditable";

@Entity()
export default class User extends Auditable {
  @Column({ type: "varchar", length: 25, nullable: false, unique: true })
  username: string;

  @Column({ type: "varchar", length: 32, nullable: false })
  password: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  phoneNumber?: string;

  @Column({ type: "varchar", nullable: true })
  address?: string;

  @Column({ type: "varchar", nullable: true })
  country?: string;

  @Column({ type: "varchar", nullable: true })
  company?: string;
}

import { Entity, Column } from "typeorm";
import Auditable from "./auditable";

@Entity()
export default class Role extends Auditable {
  @Column({ type: "varchar", unique: true, nullable: false })
  roleName: string;
}

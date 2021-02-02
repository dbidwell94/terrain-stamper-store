import { Entity, Column, ManyToMany } from "typeorm";
import Auditable from "./auditable";
import Stamp from "./stamp";

@Entity()
export default class Category extends Auditable {
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @ManyToMany((type) => Stamp, (stamp) => stamp.category)
  stamps: Stamp[];
}

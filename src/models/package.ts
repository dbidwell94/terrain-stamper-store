import { Entity, Column, OneToMany } from "typeorm";
import Auditable from "models/auditable";
import Stamp from "models/stamp";

@Entity()
export default class Package extends Auditable {
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @OneToMany((type) => Stamp, (stamp) => stamp.package)
  stamps: Stamp[];
}

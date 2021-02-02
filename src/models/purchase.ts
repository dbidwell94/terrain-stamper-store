import { Entity, Column, ManyToOne } from "typeorm";
import Auditable from "./auditable";
import Stamp from "./stamp";
import User from "./user";

@Entity()
export default class Purchase extends Auditable {
  @ManyToOne((type) => User, (user) => user.purchases)
  user: User;

  @ManyToOne((type) => Stamp, (stamp) => stamp.purchases)
  stamp: Stamp;

  @Column({ type: "varchar", nullable: false })
  paymentId: string;
}

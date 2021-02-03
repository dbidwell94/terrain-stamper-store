import { Entity, Column, ManyToOne } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Stamp from "./stamp";
import User from "./user";
import { IModel } from ".";

export interface IPurchase extends IAuditable {
  user: User;
  stamp: Stamp;
  paymentId: string;
}

@Entity()
export default class Purchase extends Auditable implements IModel {
  @ManyToOne(() => User, (user) => user.purchases, {
    cascade: true,
    onDelete: "SET NULL",
    nullable: false,
    onUpdate: "CASCADE",
    eager: true
  })
  user: Promise<User>;

  @ManyToOne(() => Stamp, (stamp) => stamp.purchases, {
    cascade: true,
    onDelete: "SET NULL",
    nullable: false,
    onUpdate: "CASCADE",
    eager: true
  })
  stamp: Promise<Stamp>;

  @Column({ type: "varchar", nullable: false })
  paymentId: string;
}

export async function getPurchase(purchase: Purchase): Promise<IPurchase> {
  const stamp = await purchase.stamp;
  const user = await purchase.user;
  return {
    id: purchase.id,
    createdAt: purchase.createdAt,
    updatedAt: purchase.updatedAt,
    paymentId: purchase.paymentId,
    stamp,
    user,
  };
}

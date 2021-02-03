import { Entity, Column, ManyToMany, ManyToOne, OneToMany, JoinTable, JoinColumn } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Category from "./category";
import Package from "./package";
import Purchase from "./purchase";
import { IModel } from ".";
import User from "./user";

export interface IStamp extends IAuditable {
  name: string;
  stampType: string;
  locationUrl: string;
  price: number;
  uploadedUser: User;
  categories: Category[];
  purchases: Purchase[];
  package?: Package;
}

export type IStampMin = Omit<IStamp, "locationUrl" | "purchases">;

@Entity()
export default class Stamp extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  stampType: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  locationUrl: string;

  @Column({ type: "decimal", nullable: false })
  price: number;

  @ManyToOne(() => User, (user) => user.uploadedStamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  uploadedUser: User;

  @ManyToMany(() => Category, (category) => category.stamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinTable({ name: "stampCategories" })
  categories: Category[];

  @OneToMany(() => Purchase, (purchase) => purchase.stamp, {
    cascade: ["insert", "update"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  purchases: Purchase[];

  @ManyToOne(() => Package, (pkg) => pkg.stamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
    eager: true,
  })
  package?: Package;
}
export function getStampMin(stamp: Stamp): IStampMin {
  return {
    id: stamp.id,
    createdAt: stamp.createdAt,
    updatedAt: stamp.updatedAt,
    name: stamp.name,
    price: stamp.price,
    stampType: stamp.stampType,
    categories: stamp.categories,
    uploadedUser: stamp.uploadedUser,
  };
}

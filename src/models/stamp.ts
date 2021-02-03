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
    eager: true
  })
  @JoinColumn()
  uploadedUser: Promise<User>;

  @ManyToMany(() => Category, (category) => category.stamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinTable({ name: "stampCategories" })
  categories: Promise<Category[]>;

  @OneToMany(() => Purchase, (purchase) => purchase.stamp, {
    cascade: ["insert", "update"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  purchases: Promise<Purchase[]>;

  @ManyToOne(() => Package, (pkg) => pkg.stamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  package?: Promise<Package>;
}

export async function getStamp(stamp: Stamp): Promise<IStamp> {
  const uploadedUser = await stamp.uploadedUser;
  const categories = await stamp.categories;
  const purchases = await stamp.purchases;
  const pkg = await stamp.package;
  return {
    id: stamp.id,
    createdAt: stamp.createdAt,
    updatedAt: stamp.updatedAt,
    name: stamp.name,
    locationUrl: stamp.locationUrl,
    price: stamp.price,
    stampType: stamp.stampType,
    uploadedUser,
    categories,
    purchases,
    package: pkg,
  };
}

export async function getStampMin(stamp: Stamp): Promise<IStampMin> {
  const fullStamp = await getStamp(stamp);
  const { purchases, locationUrl, ...stampMin } = fullStamp;
  return stampMin;
}

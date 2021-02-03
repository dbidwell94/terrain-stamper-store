import { Entity, Column, ManyToMany, ManyToOne, OneToMany, JoinTable, JoinColumn } from "typeorm";
import Auditable from "./auditable";
import Category from "./category";
import Package from "./package";
import Purchase from "./purchase";
import { IModel } from ".";
import User from "./user";

@Entity()
export default class Stamp extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  stampType: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  locationUrl: string;

  @Column({ type: "decimal", nullable: true })
  price?: number;

  @ManyToOne(() => User, (user) => user.uploadedStamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn()
  uploadedUser: Promise<User>;

  @ManyToMany(() => Category, (category) => category.stamps, {
    cascade: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinTable()
  category: Promise<Category[]>;

  @OneToMany(() => Purchase, (purchase) => purchase.stamp, {
    cascade: ["insert", "update"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  purchases: Promise<Purchase[]>;

  @ManyToOne(() => Package, (pkg) => pkg.stamps, { cascade: true, onDelete: "SET NULL", onUpdate: "CASCADE" })
  package: Promise<Package>;
}

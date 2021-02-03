import { Entity, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import Auditable from "models/auditable";
import Category from "models/category";
import Package from "models/package";
import Purchase from "models/purchase";

@Entity()
export default class Stamp extends Auditable {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  stampType: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  locationUrl: string;

  @Column({ type: "decimal", nullable: true })
  price?: number;

  @ManyToMany((type) => Category, (category) => category.stamps)
  category: Category;

  @OneToMany((type) => Purchase, (purchase) => purchase.stamp)
  purchases: Purchase[];

  @ManyToOne((type) => Package, (pkg) => pkg.stamps)
  package: Package;
}

import { Entity, Column, OneToMany } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Stamp from "./stamp";
import { IModel } from ".";

export interface IPackage extends IAuditable {
  name: string;
  description: string;
  stamps: Stamp[];
}

export type IPackageView = Pick<Package, "id" | "name" | "description">;

@Entity()
export default class Package extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @Column({ type: "varchar", length: 150, nullable: false })
  description: string;

  @OneToMany(() => Stamp, (stamp) => stamp.package, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true,
  })
  stamps: Stamp[];
}

export function getPackageMin(pkg: Package): IPackageView {
  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
  };
}

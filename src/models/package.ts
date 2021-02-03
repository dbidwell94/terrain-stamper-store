import { Entity, Column, OneToMany } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Stamp from "./stamp";
import { IModel } from ".";

export interface IPackage extends IAuditable {
  name: string;
  stamps: Stamp[];
}

@Entity()
export default class Package extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @OneToMany(() => Stamp, (stamp) => stamp.package, {
    cascade: ["update", "insert"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true
  })
  stamps: Promise<Stamp[]>;
}

export async function getPackage(pkg: Package): Promise<IPackage> {
  const stamps = await pkg.stamps;
  return {
    id: pkg.id,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
    name: pkg.name,
    stamps,
  };
}

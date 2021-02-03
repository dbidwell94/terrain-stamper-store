import { Entity, Column, ManyToMany } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Stamp from "./stamp";
import { IModel } from ".";

interface ICategory extends IAuditable {
  name: string;
  stamps: Stamp[];
}

@Entity()
export default class Category extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Stamp, (stamp) => stamp.categories, {
    cascade: ["insert", "update"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true
  })
  stamps: Promise<Stamp[]>;
}

export async function getCategory(category: Category): Promise<ICategory> {
  const stamps = await category.stamps;
  return {
    id: category.id,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    name: category.name,
    stamps,
  };
}

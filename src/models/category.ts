import { Entity, Column, ManyToMany } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Stamp from "./stamp";
import { IModel } from ".";

export interface ICategory extends IAuditable {
  name: string;
  stamps: Stamp[];
}

export type ICategoryView = Pick<ICategory, "id" | "name">;

@Entity()
export default class Category extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Stamp, (stamp) => stamp.categories, {
    cascade: ["insert", "update"],
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true,
  })
  stamps: Stamp[];
}

export function getCategory(category: Category): ICategory {
  return {
    id: category.id,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    name: category.name,
    stamps: category.stamps,
  };
}

export function getCategoryMin(category: Category): ICategoryView {
  return {
    id: category.id,
    name: category.name,
  };
}

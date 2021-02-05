import { Entity, Column, ManyToMany, ManyToOne, OneToMany, JoinTable, JoinColumn } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Category from "./category";
import Package from "./package";
import Purchase from "./purchase";
import { IModel } from ".";
import User from "./user";
import StampFile, { IStampFileCreate } from "./stampFile";
import StampPicture from "./stampPicture";

export interface IStamp extends IAuditable {
  name: string;
  stampType: string;
  folderLocation: string;
  price: number;
  isReleased: boolean;
  releaseDate: Date | null;
  uploadedUser: User;
  categories: Category[];
  purchases: Purchase[];
  package: Package | null;
  files: StampFile[];
  pictures: StampPicture[];
}

export type IStampMin = Omit<IStamp, "folderLocation" | "purchases">;

export type IStampCreate = Pick<IStamp, "name" | "folderLocation" | "price" | "stampType" | "uploadedUser"> & {
  files: StampFile[] | IStampFileCreate[]
}

@Entity()
export default class Stamp extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  stampType: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  folderLocation: string;

  @Column({ type: "decimal", nullable: false })
  price: number;

  @Column({ type: "boolean", nullable: false, default: false })
  isReleased: boolean;

  @Column({ type: "timestamptz", nullable: true })
  releaseDate: Date;

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
    nullable: true,
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
  })
  package: Package;

  @OneToMany(() => StampFile, (file) => file.stamp, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
  })
  files: StampFile[];

  @OneToMany(() => StampPicture, (picture) => picture.stamp, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
  })
  pictures: StampPicture[];
}

export function getStampMin(stamp: Stamp): IStampMin {
  return {
    id: stamp.id,
    createdAt: stamp.createdAt,
    updatedAt: stamp.updatedAt,
    name: stamp.name,
    price: stamp.price,
    isReleased: stamp.isReleased,
    package: stamp.package,
    releaseDate: stamp.releaseDate,
    stampType: stamp.stampType,
    categories: stamp.categories,
    uploadedUser: stamp.uploadedUser,
    files: stamp.files,
    pictures: stamp.pictures,
  };
}

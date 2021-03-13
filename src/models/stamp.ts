import { Entity, Column, ManyToMany, ManyToOne, OneToMany, JoinTable, JoinColumn } from "typeorm";
import Auditable, { IAuditable } from "./auditable";
import Category, { getCategoryMin, ICategoryView } from "./category";
import Package, { getPackageMin, IPackageView } from "./package";
import Purchase from "./purchase";
import { IModel } from ".";
import User from "./user";
import StampFile, { IStampFileCreate } from "./stampFile";
import StampPicture, { getStampPictureMin, IStampPictureMin } from "./stampPicture";

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
  files: StampFile[] | IStampFileCreate[];
};

export type IStampView = Pick<IStamp, "id" | "name" | "isReleased" | "price" | "releaseDate" | "stampType"> & {
  pictures: IStampPictureMin[];
  categories: ICategoryView[];
  package: IPackageView | null;
};

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
    lazy: true,
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
    lazy: true,
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

export async function getStampView(stamp: Stamp): Promise<IStampView> {
  const resolvedCategories: Category[] = await ((stamp.categories as unknown) as Promise<Category[]>);
  const resolvedPictures: StampPicture[] = await ((stamp.pictures as unknown) as Promise<StampPicture[]>);
  const categories: ICategoryView[] = resolvedCategories.map((cat) => getCategoryMin(cat));
  const pictures: IStampPictureMin[] = resolvedPictures.map((pic) => getStampPictureMin(pic));

  const pkg = await ((stamp.package as unknown) as Promise<Package>);

  return {
    categories,
    id: stamp.id,
    isReleased: stamp.isReleased,
    name: stamp.name,
    package: pkg ? getPackageMin(pkg) : null,
    pictures,
    price: stamp.price,
    releaseDate: stamp.releaseDate,
    stampType: stamp.stampType,
  };
}

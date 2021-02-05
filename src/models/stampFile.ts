import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IModel } from ".";
import Auditable from "./auditable";
import Stamp, { IStampCreate } from "./stamp";

export enum fileType {
  unityAsset = "unityAsset",
  raw = "raw",
}

export type IStampFileCreate = Pick<StampFile, "fileLocation" | "fileType"> & {
  stamp: Stamp | IStampCreate;
};

export const extensionsToFileType: Record<string, fileType> = {
  unitypackage: fileType.unityAsset,
  zip: fileType.raw,
};

@Entity()
export default class StampFile extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false })
  fileLocation: string;

  @Column({ type: "varchar", nullable: false, length: 20 })
  fileType: string;

  @ManyToOne(() => Stamp, (stamp) => stamp.files, { nullable: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn()
  stamp: Stamp;
}

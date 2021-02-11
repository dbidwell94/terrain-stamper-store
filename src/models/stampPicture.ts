import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IModel } from ".";
import Auditable from "./auditable";
import Stamp, { IStampCreate } from "./stamp";

export type IStampPictureMin = Pick<StampPicture, "id">;

export type IStampPictureCreate = Pick<StampPicture, "fileLocation"> & {
  stamp: IStampCreate | Stamp;
};

export type IStampPictureDetails = Pick<StampPicture, "id" | "stamp" | "fileLocation">;

export const validExtensions = ["bmp", "jpg", "jpeg", "png", "gif"];

@Entity()
export default class StampPicture extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false })
  fileLocation: string;

  @ManyToOne(() => Stamp, (stamp) => stamp.pictures, { onDelete: "CASCADE", onUpdate: "CASCADE", lazy: true })
  @JoinColumn()
  stamp: Stamp;
}

export function getStampPictureMin(picture: StampPicture): IStampPictureMin {
  return {
    id: picture.id,
  };
}

export async function getFullStampPicture(picture: StampPicture): Promise<IStampPictureDetails> {
  const stampPromise = (picture.stamp as unknown) as Promise<Stamp>;

  const stamp = await stampPromise;

  return {
    id: picture.id,
    stamp,
    fileLocation: picture.fileLocation
  };
}

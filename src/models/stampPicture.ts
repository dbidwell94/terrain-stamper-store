import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IModel } from ".";
import Auditable from "./auditable";
import Stamp from "./stamp";

export type IStampPictureMin = Pick<StampPicture, "id">;

@Entity()
export default class StampPicture extends Auditable implements IModel {
  @Column({ type: "varchar", nullable: false })
  fileLocation: string;

  @ManyToOne(() => Stamp, (stamp) => stamp.pictures, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn()
  stamp: Stamp;
}

export function getStampPictureMin(picture: StampPicture): IStampPictureMin {
  return {
    id: picture.id,
  };
}

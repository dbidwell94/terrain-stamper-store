import { Entity, Column,  } from "typeorm";
import Auditable from "./auditable";
import { IModel } from ".";

@Entity()
export default class Company extends Auditable implements IModel{
  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  taxId: string;

  @Column({ type: "varchar", nullable: true })
  phoneNumber?: string;

  @Column({ type: "varchar", nullable: true })
  address?: string;

  @Column({ type: "varchar", nullable: true })
  country?: string;
}

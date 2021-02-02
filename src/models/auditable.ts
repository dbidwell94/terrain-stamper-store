import { Column, PrimaryGeneratedColumn } from "typeorm";

export interface IAuditable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IAuditableMin = Omit<IAuditable, "createdAt" | "updatedAt">;

export default abstract class Auditable {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}

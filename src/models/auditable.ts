import { BeforeUpdate, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export interface IAuditable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IAuditableMin = Omit<IAuditable, "createdAt" | "updatedAt">;

export default abstract class Auditable {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeUpdate()
  private onUpdate() {
    this.updatedAt = new Date(Date.now());
  }
}

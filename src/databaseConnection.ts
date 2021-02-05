import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from "typeorm";
import User from "../src/models/user";
import Role from "../src/models/role";
import Category from "../src/models/category";
import Stamp from "../src/models/stamp";
import Package from "../src/models/package";
import Company from "../src/models/company";
import Purchase from "../src/models/purchase";
import StampFile from "./models/stampFile";
import StampPicture from "./models/stampPicture";

const entities = [User, Role, Category, Stamp, Package, Company, Purchase, StampFile, StampPicture];

export const connectionOptions: ConnectionOptions =
  process.env.NODE_ENV === "development"
    ? {
        type: "postgres",
        host: "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres",
        database: process.env.POSTGRES_DB || "stamp-terrain-store",
        entities,
        synchronize: false,
        migrations: ["src/migrations/**/*.ts"],
        cli: {
          migrationsDir: "src/migrations",
          entitiesDir: "src/models",
        },
      }
    : {
        type: "postgres",
        host: "database",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres",
        database: process.env.POSTGRES_DB || "stamp-terrain-store",
        entities,
        migrations: ["src/migrations/**/*.ts"],
        synchronize: false,
        cli: {
          migrationsDir: "src/migrations",
        },
      };

const connection: Promise<Connection> = createConnection(connectionOptions);
export default connection;

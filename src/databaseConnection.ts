import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from "typeorm";
import User from "../src/models/user";
import Role from "../src/models/role";
import Category from "../src/models/category";
import Stamp from "../src/models/stamp";
import Package from "../src/models/package";
import Company from "../src/models/company";
import Purchase from "../src/models/purchase";

const entities = [User, Role, Category, Stamp, Package, Company, Purchase];

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
        // synchronize: true,
        migrations: ["src/migrations/**/*.ts"],
        cli: {
          migrationsDir: "src/migrations",
          entitiesDir: "src/models",
        },
      }
    : {
        type: "postgres",
        url: process.env.DB_URL,
        name: "default",
        entities,
        migrations: ["./migrations/*.ts"],
        synchronize: false,
        cli: {
          migrationsDir: "src/migrations",
        },
      };

console.log(connectionOptions);

const connection: Promise<Connection> = createConnection(connectionOptions);
export default connection;

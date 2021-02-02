import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from "typeorm";
import User from "./models/user";
import Role from "./models/role";
import Category from "./models/category";
import Stamp from "./models/stamp";
import Package from "./models/package";
import Company from "./models/company";
import Purchase from "./models/purchase";

const entities = [User, Role, Category, Stamp, Package, Company, Purchase];

const connectionOptions: ConnectionOptions =
  process.env.NODE_ENV === "development"
    ? {
        type: "postgres",
        host: "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres",
        database: process.env.POSTGRES_DB || "stamp-terrain-store",
        entities,
        synchronize: true,
      }
    : {
        type: "postgres",
        url: process.env.DB_URL,
        name: "default",
        entities,
        synchronize: true,
      };

console.log(connectionOptions);

const connection: Promise<Connection> = createConnection(connectionOptions);
export default connection;

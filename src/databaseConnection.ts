import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from "typeorm";
import User from "./models/user";
import Roles from "./models/roles";

const entities = [User, Roles];

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
        synchronize: true
      }
    : {
        type: "postgres",
        url: process.env.DB_URL,
        name: "default",
        entities,
        synchronize: true,
      };

console.log(connectionOptions)

const connection: Promise<Connection> = createConnection(connectionOptions);
export default connection;

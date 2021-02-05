import Stamp from "../models/stamp";
import { AbstractService } from "./index";

export default class StampServices extends AbstractService<Stamp> {
  async getStampLocationById(id: number): Promise<string> {
    const stamp = await this.getById(id);

    return stamp.folderLocation;
  }
}

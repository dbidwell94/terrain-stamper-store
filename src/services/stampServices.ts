import StampPicture from "src/models/stampPicture";
import Stamp, { getStampView, IStampView } from "../models/stamp";
import { AbstractService } from "./index";

export default class StampServices extends AbstractService<Stamp> {
  async getStampLocationById(id: number): Promise<string> {
    const stamp = await this.getById(id);

    return stamp.folderLocation;
  }

  async getStampMinById(id: number): Promise<IStampView> {
    const stamp = await this.getById(id);

    return getStampView(stamp);
  }

  async getStampsMin(limit?: number): Promise<IStampView[]> {
    const stamps = await this.repository.find({
      where: { isReleased: true },
      order: { releaseDate: "DESC" },
      loadEagerRelations: true,
    });

    const minStamps = stamps.map((stamp) => getStampView(stamp));

    return Promise.all(minStamps);
  }

  async getStamps(limit?: number): Promise<IStampView[]> {
    const stamps = await this.repository
      .createQueryBuilder()
      .select()
      .limit(limit || 50)
      .getMany();

    const toReturn = stamps.map((stamp) => getStampView(stamp));

    return await Promise.all(toReturn);
  }

  async getStampsByUploadedUserId(id: number): Promise<IStampView[]> {
    // const stamps = await this.repository.createQueryBuilder().select().where({ uploadedUser: id }).getMany();
    const stamps = await this.repository.find({
      where: { uploadedUser: id },
      loadEagerRelations: true,
    });

    const toReturn = stamps.map((stamp) => getStampView(stamp));

    return await Promise.all(toReturn);
  }
}

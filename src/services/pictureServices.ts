import StampPicture, { IStampPictureDetails, getFullStampPicture } from "../models/stampPicture";
import { AbstractService } from ".";

export default class PictureServices extends AbstractService<StampPicture> {
  async getPictureMinById(id: number): Promise<IStampPictureDetails> {
    const picture = await this.getById(id);

    return await getFullStampPicture(picture);
  }
}

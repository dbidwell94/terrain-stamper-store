import ApiClient from '.';

interface IUploadFileArgs {
  stamp: File;
  stampName: string;
  stampType: string;
  price: number;
  progressEventCallback?: (arg: ProgressEvent) => void;
}

interface ICategory {
  id: number;
  name: string;
}

interface IPicture {
  id: number;
}

interface IPackage {
  id: number;
  name: string;
  description: string;
}

interface IStampView {
  id: number;
  isReleased: boolean;
  name: string;
  package: IPackage | null;
  pictures: IPicture[];
  price: number;
  releaseDate: string;
  stampType: string;
  categories: ICategory[];
}

export default class StampApiClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async uploadStampFile(uploadOptions: IUploadFileArgs): Promise<void> {
    const { price, stamp, stampName, stampType, progressEventCallback } = uploadOptions;
    const arrayBuffer = await stamp.arrayBuffer();
    const fileBlob: Blob = new Blob([new Uint8Array(arrayBuffer)]);
    const data = new FormData();
    data.append('stamp', fileBlob);
    data.append('stampName', stampName)
    data.append('stampType', stampType)
    data.append('price', price.toString());
    await this.axios.post('/api/stamps/stamp/upload', data, { onUploadProgress: progressEventCallback });
  }

  async getStampById(id: number): Promise<IStampView> {
    const stamp = await this.axios.get<IStampView>(`/api/stamps/public/stamp/${id}`);
    return stamp.data;
  }

  async getStamps(): Promise<IStampView[]> {
    const stamps = await this.axios.get<IStampView[]>(`/api/stamps/public/stamps`);
    return stamps.data;
  }
}

import axios from "axios";
import { IUrlDownloader } from "./iurlDownloader";

export class UrlDownloader implements IUrlDownloader {
  public async download(url: string, options: any): Promise<string> {
    const response = await axios.get(url);

    return response.data;
  }
}

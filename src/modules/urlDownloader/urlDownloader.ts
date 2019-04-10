import request from "request-promise-native";
import { IUrlDownloader } from "./iurlDownloader";

export class UrlDownloader implements IUrlDownloader {
  public async download(url: string, options: any): Promise<string> {
    options.uri = options.uri || url;
    const response = await request(options);

    return response.toString();
  }
}

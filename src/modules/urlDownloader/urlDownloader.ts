import axios from "axios";
import fs from "fs";
import { IUrlDownloader } from "./iurlDownloader";

export class UrlDownloader implements IUrlDownloader {
  public async download(url: string): Promise<string> {
    const response = await axios.get(url);

    return response.data;
  }

  public async downloadFile(url: string, target: string): Promise<void> {

    const response = await axios.get(url, {
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(target);
    // (response.data as ReadableStream).pipeTo(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
}

import axios from "axios";
import fs from "fs";
import { IUrlDownloader } from "./iurlDownloader";

export class UrlDownloader implements IUrlDownloader {
  public async download<T>(url: string): Promise<T> {
    const response = await axios.get<T>(url);

    return response.data;
  }

  public async downloadFile(url: string, target: string): Promise<void> {

    const response = await axios.get(url, {
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(target);
    (response.data as any).pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
}

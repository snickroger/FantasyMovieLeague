export interface IUrlDownloader {
  download(url: string): Promise<string>;
  downloadFile(url: string, target: string): Promise<void>;
}

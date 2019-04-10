export interface IUrlDownloader {
  download(url: string, options: any): Promise<string>;
}

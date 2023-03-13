export interface IUrlDownloader {
  download<T>(url: string): Promise<T>;
  downloadFile(url: string, target: string): Promise<void>;
}

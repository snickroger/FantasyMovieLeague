export interface IPostersDownloader {
  downloadPosters(slug: string): Promise<void>;
}

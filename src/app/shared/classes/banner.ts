export class BannerModel {
  id: number;
  description: string;
  image: File;
  hyperlink: string;
  status: number;

  clear() {
    this.id = undefined;
    this.description = '';
    this.status = 0;
  }
}

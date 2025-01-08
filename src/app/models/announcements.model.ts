export interface Announcement {
  id: string; // Optional since it will be generated
  name: string;
  url: string;
  dateFrom: Date;
  dateTo: Date;
  pictureUrl?: string; // Optional for image upload
}

export interface Announcement {
  id: string;
  name: string;
  url: string;
  dateFrom: Date;
  dateTo: Date;
  pictureUrl?: string; // Optional for image upload
}

export default interface File {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

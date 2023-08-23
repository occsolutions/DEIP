
import UploadsConfig from '../uploads/config';

export class Config {
  public host: string;
  public port: number;
  public pool?: boolean;
  public uploads: UploadsConfig;
  public publicUrl: string;
}

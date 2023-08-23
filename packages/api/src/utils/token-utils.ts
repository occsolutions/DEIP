
import * as bcryptjs from 'bcryptjs';

class TokenUtils {

  private saltRounds = 5;

  public async hash(password: string): Promise<string> {
    return await bcryptjs.hash(password, this.saltRounds);
  }

  public sanitize(hash: string): string {
    const cd = [':', '.', '=', '%', '/', '-', '?', '$', '#', '[', ']', '{', '}', ',',
      ';', '(', ')', '+', '*', '&', '^'];
    cd.forEach((ch) => {
      hash = hash.trim().split(ch).join('');
    });
    return hash;
    // return hash.split('').map((ltr) => ltr.match(/[\/\?\=\\]{1}/gi) ? '' : ltr).join('O');
  }
}

export default new TokenUtils();

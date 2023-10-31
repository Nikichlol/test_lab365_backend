/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { User as MyUser } from 'src/modules/user/user.schema';

declare global {
  namespace Express {
    interface Request {
      currentUser: MyUser;
    }
  }
}

import * as bcrypt from 'bcrypt';

export const hashPassword = async (pw: string) => {
  return await bcrypt.hash(pw, 10);
};

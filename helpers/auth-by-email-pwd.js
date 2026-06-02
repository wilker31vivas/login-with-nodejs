import { USERS_BBDD } from "../bbdd.js";

const authByEmailPwd = (email, password) => {
  const user = USERS_BBDD.find((item) => item.email === email)

  if (!user) throw new Error();

  if(user.password !== password) throw new Error();

  return user
};

export default authByEmailPwd;

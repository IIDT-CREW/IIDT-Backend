const dbHelpers = require('./mysqlHelpersPromise');

/* 회원 가입  */
const getWill = async (parameter) => {
  const mem_username = parameter.mem_username;
  const mem_userid = parameter.mem_userid;
  const mem_email = parameter.mem_email;
  const mem_password = parameter.mem_password;
  const mem_social = parameter.mem_social;

  const signUpSql = `
  INSERT INTO IIDT_MEMBER (MEM_USERNAME, MEM_USERID, MEM_EMAIL, MEM_PASSWORD, MEM_SOCIAL) 
  VALUES (?, ?, ?, ?, ?)
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [memberInfo] = await connection.query(signUpSql, [
      mem_username,
      mem_userid,
      mem_email,
      mem_password,
      mem_social,
    ]);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return memberInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

module.exports = {
  getLoginData: getLoginData,
};

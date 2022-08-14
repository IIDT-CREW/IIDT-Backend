const dbHelpers = require('./mysqlHelpersPromise');

/* 회원 가입  */
const setMemberSignUp = async (parameter) => {
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

//findByEmail
/* 이메일 중복 체크 */
const getEmailIsAlreadyExist = async (mem_email) => {
  const findExistSql = `
  SELECT CASE WHEN count(MEM_EMAIL) > 0 THEN 'EXIST'
            ELSE 'NONE'
            END AS EXISTFLAG
  FROM MEMBER
  WHERE MEM_EMAIL = ?
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [memberInfo] = await connection.query(findExistSql, [mem_email]);
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

/*login , join  */
const getLoginData = async (mem_email) => {
  let loginSql = `
      SELECT 
      MEM_IDX, 
      MEM_EMAIL ,
      MEM_USERNAME, 
      MEM_GB_CD ,
      MEM_STATUS
      FROM MEMBER
      WHERE MEM_EMAIL = ?
    `;

  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      //await connection.beginTransaction(); // START TRANSACTION
      let [memberInfo] = await connection.query(loginSql, [mem_email]);
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
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};

module.exports = {
  setMemberSignUp: setMemberSignUp,
  getLoginData: getLoginData,
  getEmailIsAlreadyExist: getEmailIsAlreadyExist,
};

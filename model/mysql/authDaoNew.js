const dbHelpers = require('./mysqlHelpersPromise');

/* 회원 가입  */
const setMemberSignUp = async (parameter) => {
  const mem_username = parameter.mem_username;
  const mem_userid = parameter.mem_userid;
  const mem_email = parameter.mem_email;
  const mem_password = parameter.mem_password;
  const mem_social = parameter.mem_social;

  const signUpSql = `
  INSERT INTO MEMBER (mem_username, mem_userid, mem_email, mem_password, mem_social) 
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
  SELECT CASE WHEN count(mem_email) > 0 THEN 'EXIST'
            ELSE 'NONE'
            END AS EXISTFLAG
  FROM MEMBER
  WHERE mem_email = ?
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
      mem_idx, 
      mem_email ,
      mem_username, 
      mem_gb_cd ,
      mem_status
      FROM MEMBER
      WHERE mem_email = ?
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

const getMemberInfo = async (parameter) => {
  const BOARD_NUM = parameter.BOARD_NUM;
  let postsListSql = `
        SELECT *
        FROM MEMBER
        WHERE MEM_IDX  = (
                  SELECT MEM_IDX
                  FROM board_posts
                  WHERE posts_num = ?
                );
    `;

  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      //await connection.beginTransaction(); // START TRANSACTION
      let [getPostListRows] = await connection.query(postsListSql, [BOARD_NUM]);
      await connection.commit(); // COMMIT
      connection.release();
      console.log('success Query SELECT');
      return getPostListRows;
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
  getMemberInfo: getMemberInfo,
  getEmailIsAlreadyExist: getEmailIsAlreadyExist,
};

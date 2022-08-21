const dbHelpers = require('./mysqlHelpersPromise');

/* 회원 가입  */
const setMemberSignUp = async (parameter) => {
  const mem_username = parameter?.mem_username;
  const mem_userid = parameter?.mem_userid;
  const mem_email = parameter?.mem_email;
  const mem_social = parameter?.mem_social;
  const mem_nickname = parameter?.mem_nickname;
  const signUpSql = `
  INSERT INTO IIDT_MEMBER (MEM_USERNAME, MEM_USERID, MEM_EMAIL, MEM_SOCIAL,MEM_NICKNAME) 
  VALUES (?, ?, ?, ?, ?)
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [memberInfo] = await connection.query(signUpSql, [
      mem_username,
      mem_userid,
      mem_email,
      mem_social,
      mem_nickname,
    ]);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('[setMemberSignUp] success Query SELECT');
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
const getEmailIsAlreadyExist = async (
  mem_email,
  has_email = true,
  social = '',
  mem_id = '',
) => {
  let findExistSql = `
    SELECT CASE WHEN count(MEM_EMAIL) > 0 THEN 'EXIST'
              ELSE 'NONE'
              END AS EXISTFLAG
    FROM IIDT_MEMBER
    WHERE MEM_EMAIL = ?
  `;
  const kakaoHasNotEmail = !has_email && social === 'kakao';
  /* 카카오톡인 경우 비즈앱 설정 X시, 이메일이 필수 체크가 아닐수도 있음   */
  if (kakaoHasNotEmail) {
    findExistSql = `
      SELECT CASE WHEN count(MEM_USERID) > 0 THEN 'EXIST'
      ELSE 'NONE'
      END AS EXISTFLAG
      FROM IIDT_MEMBER
      WHERE MEM_USERID = ? AND MEM_SOCIAL = ?
    `;
  }
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let memberInfo;
    if (kakaoHasNotEmail)
      memberInfo = await connection.query(findExistSql, [mem_id, social]);
    else memberInfo = await connection.query(findExistSql, [mem_email]);

    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');

    console.log('[getEmailIsAlreadyExist]  ', memberInfo[0]);
    return memberInfo[0];
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
      MEM_NICKNAME,
      MEM_GB_CD ,
      MEM_STATUS
      FROM IIDT_MEMBER
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

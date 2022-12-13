const dbHelpers = require('./mysqlHelpersPromise');

const getWillQuestion = async () => {
  const getWillSql = `
    SELECT *
    FROM WILL_QUESTION;
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willInfo] = await connection.query(getWillSql);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return willInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

const getWillCount = async () => {
  const getWillSql = `
    SELECT count(*) AS COUNT
    FROM WILL
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willInfo] = await connection.query(getWillSql);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return willInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

const getWillList = async (parameter) => {
  const getWillSql = `
        SELECT SQL_CALC_FOUND_ROWS 
        TITLE,
        CONTENT,
        THUMBNAIL, 
        EDIT_DATE, 
        REG_DATE, 
        IS_PRIVATE, 
        IS_DELETE, 
        MEM_IDX, 
        (SELECT MEM_NICKNAME  
          FROM IIDT_MEMBER IM
          WHERE IM.MEM_IDX = WL.MEM_IDX ) as MEM_NICKNAME,   
        CONTENT_TYPE,
        WL.WILL_ID,
        GROUP_CONCAT(QS_IDX  ORDER BY QS_IDX ) AS QS_IDX,
        GROUP_CONCAT(QS_ESSAY_ANS ORDER BY QS_IDX) AS QS_ESSAY_ANS
      FROM WILL WL
      LEFT JOIN WILL_ESSAY_ANSWER WL_E_A ON WL.WILL_ID = WL_E_A.WILL_ID WHERE WL.IS_PRIVATE=FALSE
      GROUP BY WL.WILL_ID
      ORDER BY WL.REG_DATE DESC
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willListInfo] = await connection.query(getWillSql);

    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return willListInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

const getWill = async (parameter) => {
  const will_id = parameter.will_id;
  const getWillSql = `
    select *
    from WILL
    WHERE WILL_ID = ?
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willInfo] = await connection.query(getWillSql, [will_id]);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return willInfo[0];
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

const getMyWill = async (parameter) => {
  const mem_idx = parameter.mem_idx;

  const getMyWillSql = `
      SELECT SQL_CALC_FOUND_ROWS TITLE,
      CONTENT,
      THUMBNAIL, 
      EDIT_DATE, 
      REG_DATE, 
      IS_PRIVATE, 
      IS_DELETE, 
      MEM_IDX,
      (SELECT MEM_NICKNAME  
        FROM IIDT_MEMBER IM
        WHERE IM.MEM_IDX = WL.MEM_IDX ) as MEM_NICKNAME,   
      CONTENT_TYPE,
            WL.WILL_ID,
      GROUP_CONCAT(QS_IDX  ORDER BY QS_IDX ) AS QS_IDX ,
            GROUP_CONCAT(QS_ESSAY_ANS ORDER BY QS_IDX) AS QS_ESSAY_ANS
    FROM WILL WL
    LEFT JOIN WILL_ESSAY_ANSWER WL_E_A ON WL.WILL_ID = WL_E_A.WILL_ID WHERE WL.IS_PRIVATE=FALSE AND WL.MEM_IDX = ?
    GROUP BY WL.WILL_ID
    ORDER BY WL.REG_DATE DESC
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willInfo] = await connection.query(getMyWillSql, [mem_idx]);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return willInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

// INSERT INTO WILL_ESSAY_ANSWER (QS_ESSAY_ANS, QS_IDX, WILL_ID)
// VALUES ('TEST 1',1, '8x-Ub4AtcbQB0kKli9wSG'),
//   ('TEST 2',2, '8x-Ub4AtcbQB0kKli9wSG'),
//   ('TEST 3',3, '8x-Ub4AtcbQB0kKli9wSG'),
//   ('TEST 4',4, '8x-Ub4AtcbQB0kKli9wSG'),
//   ('TEST 5',5, '8x-Ub4AtcbQB0kKli9wSG'),
//   ('TEST 6',6, '8x-Ub4AtcbQB0kKli9wSG'),
//   ('TEST 7',7, '8x-Ub4AtcbQB0kKli9wSG');
const insertWill = async (parameter) => {
  const title = parameter.title;
  const content = parameter.content;
  const thumbnail = parameter.thumbnail;
  const mem_idx = parameter.mem_idx;
  const will_id = parameter.will_id;
  const content_type = parameter.content_type;
  const is_private = parameter.is_private;
  let answer_list = parameter?.answer_list;
  console.log(answer_list);
  const insertWillSql = `
    INSERT INTO WILL (TITLE, CONTENT, THUMBNAIL, REG_DATE, IS_PRIVATE, MEM_IDX, WILL_ID, CONTENT_TYPE ) 
    VALUES (?, ?, ?, now(), ?, ?, ?, ? );
  `;
  let bindVariable = '';
  let queryArray = [];
  if (answer_list) {
    answer_list = answer_list?.map((item) => {
      return [item.qs_idx, item.qs_essay_answer, will_id];
      // return item.qs_idx, item.qs_eseay_ans, will_id;
    });
    //queryArray = answer_list.flat();

    // answer_list.forEach((item, index) => {
    //   if (answer_list.length === index + 1) {
    //     bindVariable = `(?, ?, ?)`;
    //   } else {
    //     bindVariable = `(?, ?, ?),`;
    //   }
    // });
  }
  console.log('queryArray= ', queryArray);
  console.log('answer_list= ', answer_list);
  console.log('bindVariable-= ', bindVariable);
  console.log('content_type = ', content_type);
  const insertWillEssayAnswer = `
	  INSERT INTO WILL_ESSAY_ANSWER (QS_IDX, QS_ESSAY_ANS, WILL_ID)
    VALUES ? `;

  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction(); // START TRANSACTION
    let [insertWillInfo] = await connection.query(insertWillSql, [
      title,
      content,
      thumbnail,
      is_private,
      mem_idx,
      will_id,
      content_type,
    ]);
    await connection.commit(); // COMMIT

    if (content_type === 1) {
      let [insertEassyAnswerInfo] = await connection.query(
        insertWillEssayAnswer,
        [answer_list],
      );
    }
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return insertWillInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

const deleteWill = async (parameter) => {
  const will_id = parameter.will_id;
  const getWillSql = `
    DELETE FROM WILL
    WHERE WILL_ID = ?
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willInfo] = await connection.query(getWillSql, [will_id]);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return willInfo[0];
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

const updateWill = async (parameter) => {
  const title = parameter.title;
  const content = parameter.content;
  const thumbnail = parameter.thumbnail;
  const mem_idx = parameter.mem_idx;
  const will_id = parameter.will_id;
  const content_type = parameter.content_type;
  const is_private = parameter.is_private;
  const updateWillSql = `
    UPDATE WILL 
    SET TITLE = ?, CONTENT = ?, THUMBNAIL =? , REG_DATE =now(),  IS_PRIVATE =?,  MEM_IDX =?,  WILL_ID=?, CONTENT_TYPE=? 
    WHERE WILL_ID = ? 
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [insertWillInfo] = await connection.query(updateWillSql, [
      title,
      content,
      thumbnail,
      is_private,
      mem_idx,
      will_id,
      content_type,
      will_id,
    ]);
    await connection.commit(); // COMMIT
    connection.release();
    console.log('success Query SELECT');
    return insertWillInfo;
  } catch (err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    console.log('Query Error', err);
    return false;
  }
};

//todo edit
module.exports = {
  getWillQuestion: getWillQuestion,
  getWill: getWill,
  getWillList: getWillList,
  getMyWill: getMyWill,
  deleteWill: deleteWill,
  insertWill: insertWill,
  updateWill: updateWill,
  getWillCount: getWillCount,
};

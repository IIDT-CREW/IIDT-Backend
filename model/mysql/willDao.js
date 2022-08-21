const dbHelpers = require('./mysqlHelpersPromise');

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
  const mem_userid = parameter.mem_userid;

  const getMyWillSql = `
    SELECT *
    FROM WILL
    WHERE MEM_IDX = (
        SELECT MEM_IDX
        FROM IIDT_MEMBER
        WHERE MEM_USERID = ?
    )
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [willInfo] = await connection.query(getMyWillSql, [mem_userid]);
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

const insertWill = async (parameter) => {
  const title = parameter.title;
  const content = parameter.content;
  const thumbnail = parameter.thumbnail;
  const mem_idx = parameter.mem_idx;
  const will_id = parameter.will_id;

  const insertWillSql = `
    INSERT INTO WILL (TITLE, CONTENT, THUMBNAIL, REG_DATE, IS_PRIVATE, MEM_IDX, WILL_ID ) 
    VALUES (?, ?, ?, now(), false, ?, ? );
  `;
  const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
  try {
    //await connection.beginTransaction(); // START TRANSACTION
    let [insertWillInfo] = await connection.query(insertWillSql, [
      title,
      content,
      thumbnail,
      mem_idx,
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

//todo edit
module.exports = {
  getWill: getWill,
  getMyWill: getMyWill,
  deleteWill: deleteWill,
  insertWill: insertWill,
  getWillCount: getWillCount,
};

let express = require('express');
let router = express.Router();
const _ = require('lodash');
const helpers = require('../../lib/helpers');
const winston = require('winston');
const willDao = require('../../model/mysql/willDao');
const { API_CODE } = require('../../lib/statusCode');
const resMessage = require('../../lib/resMessage');

//내가 작성한 유서 가져오기
//...todo auth 추가
router.get('/getMyWill', async (req, res) => {
  const parameter = {
    mem_userid: req.query.mem_userid,
    mem_email: req.query.mem_email,
  };
  console.log(parameter);
  try {
    const willInfo = await willDao.getMyWill(parameter);
    console.log('willInfo = ', willInfo);
    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo,
    );
    console.log('responseData', responseData);
    res.json(responseData);
  } catch (e) {
    console.log(e);
    const responseData = helpers.returnResponse(
      API_CODE.INTERNAL_ERROR,
      resMessage.INTERNAL_ERROR,
      null,
    );
    res.json(responseData);
  }
});

//공유용 가져오기
router.get('/getWill', async (req, res) => {
  const parameter = {
    will_id: req.query.will_id,
  };
  console.log(parameter);
  try {
    const willInfo = await willDao.getWill(parameter);
    console.log('willInfo = ', willInfo);
    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo,
    );
    console.log('responseData', responseData);
    res.json(responseData);
  } catch (e) {
    console.log(e);
    const responseData = helpers.returnResponse(
      API_CODE.INTERNAL_ERROR,
      resMessage.INTERNAL_ERROR,
      null,
    );
    res.json(responseData);
  }
});

//추가
//...todo auth 추가
router.post('/insertWill', async (req, res) => {
  const parameter = {
    title: req.body.title,
    content: req.body.content,
    thumbnail: req.body.thumbnail,
    mem_idx: req.body.mem_idx,
    will_id: req.body.will_id,
  };
  console.log(parameter);
  try {
    const willInfo = await willDao.insertWill(parameter);
    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo,
    );

    res.json(responseData);
  } catch (e) {
    const responseData = helpers.returnResponse(
      API_CODE.INTERNAL_ERROR,
      resMessage.INTERNAL_ERROR,
      null,
    );
    res.json(responseData);
  }
});

// 삭제
//...todo auth 추가
router.post('/deleteWill', async (req, res) => {
  const parameter = {
    will_id: req.body.will_id,
  };
  console.log(parameter);
  try {
    const willInfo = await willDao.deleteWill(parameter);
    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo,
    );

    res.json(responseData);
  } catch (e) {
    const responseData = helpers.returnResponse(
      API_CODE.INTERNAL_ERROR,
      resMessage.INTERNAL_ERROR,
      null,
    );
    res.json(responseData);
  }
});

module.exports = router;

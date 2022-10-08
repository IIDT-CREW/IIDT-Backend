let express = require('express');

let router = express.Router();

const _ = require('lodash');

const helpers = require('../../lib/helpers');

const winston = require('winston');

const willDao = require('../../model/mysql/willDao');

const {
  API_CODE
} = require('../../lib/statusCode');

const resMessage = require('../../lib/resMessage');

const authMiddleware = require('../../middlewares/auth'); //


router.get('/getWillCount', async (req, res) => {
  try {
    const willInfo = await willDao.getWillCount();
    const responseData = helpers.returnResponse(API_CODE.SUCCESS, resMessage.SUCCESS, willInfo[0].COUNT);
    res.json(responseData);
  } catch (e) {
    console.log(e);
    const responseData = helpers.returnResponse(API_CODE.INTERNAL_ERROR, resMessage.INTERNAL_ERROR, null);
    res.json(responseData);
  }
}); //내가 작성한 유서 가져오기
//...todo auth 추가

router.get('/getMyWill', authMiddleware, async (req, res) => {
  const parameter = {
    mem_userid: req.query.mem_userid,
    mem_email: req.query.mem_email
  };

  try {
    const willInfo = await willDao.getMyWill(parameter);
    const responseData = helpers.returnResponse(API_CODE.SUCCESS, resMessage.SUCCESS, willInfo);
    res.json(responseData);
  } catch (e) {
    console.log(e);
    const responseData = helpers.returnResponse(API_CODE.INTERNAL_ERROR, resMessage.INTERNAL_ERROR, null);
    res.json(responseData);
  }
}); //공유용 가져오기

router.get('/getWill', async (req, res) => {
  const parameter = {
    will_id: req.query.will_id
  };

  try {
    const willInfo = await willDao.getWill(parameter);
    const responseData = helpers.returnResponse(API_CODE.SUCCESS, resMessage.SUCCESS, willInfo);
    res.json(responseData);
  } catch (e) {
    console.log(e);
    const responseData = helpers.returnResponse(API_CODE.INTERNAL_ERROR, resMessage.INTERNAL_ERROR, null);
    res.json(responseData);
  }
}); //추가

router.post('/insertWill', authMiddleware, async (req, res) => {
  const parameter = {
    title: req.body.title,
    content: req.body.content,
    content_type: req.body.content_type,
    thumbnail: req.body.thumbnail,
    mem_idx: req.body.mem_idx,
    will_id: req.body.will_id
  };

  try {
    const willInfo = await willDao.insertWill(parameter);
    const responseData = helpers.returnResponse(API_CODE.SUCCESS, resMessage.SUCCESS, willInfo);
    res.json(responseData);
  } catch (e) {
    const responseData = helpers.returnResponse(API_CODE.INTERNAL_ERROR, resMessage.INTERNAL_ERROR, null);
    res.json(responseData);
  }
}); //수정

router.post('/updateWill', authMiddleware, async (req, res) => {
  const parameter = {
    title: req.body.title,
    content: req.body.content,
    content_type: req.body.content_type,
    thumbnail: req.body.thumbnail,
    mem_idx: req.body.mem_idx,
    will_id: req.body.will_id
  };

  try {
    const willInfo = await willDao.updateWill(parameter);
    const responseData = helpers.returnResponse(API_CODE.SUCCESS, resMessage.SUCCESS, willInfo);
    res.json(responseData);
  } catch (e) {
    const responseData = helpers.returnResponse(API_CODE.INTERNAL_ERROR, resMessage.INTERNAL_ERROR, null);
    res.json(responseData);
  }
}); // 삭제

router.post('/deleteWill', authMiddleware, async (req, res) => {
  const parameter = {
    will_id: req.body.will_id
  };
  console.log(parameter);

  try {
    const willInfo = await willDao.deleteWill(parameter);
    const responseData = helpers.returnResponse(API_CODE.SUCCESS, resMessage.SUCCESS, willInfo);
    res.json(responseData);
  } catch (e) {
    const responseData = helpers.returnResponse(API_CODE.INTERNAL_ERROR, resMessage.INTERNAL_ERROR, null);
    res.json(responseData);
  }
});
module.exports = router;
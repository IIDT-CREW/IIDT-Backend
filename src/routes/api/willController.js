let express = require('express');
let router = express.Router();
const _ = require('lodash');
const helpers = require('../../lib/helpers');
const winston = require('winston');
const willDao = require('../../model/mysql/willDao');
const { API_CODE } = require('../../lib/statusCode');
const resMessage = require('../../lib/resMessage');
const authMiddleware = require('../../middlewares/auth');

router.get('/getWillQuestion', async (req, res) => {
  try {
    const willInfo = await willDao.getWillQuestion();

    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo,
    );
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

//
router.get('/getWillCount', async (req, res) => {
  try {
    const willInfo = await willDao.getWillCount();

    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo[0].COUNT,
    );

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

//내가 작성한 유서 가져오기
router.get('/getMyWill', authMiddleware, async (req, res) => {
  const parameter = {
    mem_idx: req.query.memIdx,
  };

  try {
    const willInfo = await willDao.getMyWill(parameter);
    const rows = helpers.makePaginate(req, willInfo);
    rows.willList = rows.willList.map((will) => {
      let answer_list = [];
      if (will.QS_IDX && will.QS_ESSAY_ANS) {
        const qsIndex = will.QS_IDX.split(',').map((qsIdx) => {
          return { question_index: qsIdx };
        });
        const qsEssayAns = will.QS_ESSAY_ANS.split(',').map((qsAns) => {
          return { question_answer: qsAns };
        });
        answer_list = qsIndex.map((item, index) => {
          return { ...item, ...qsEssayAns[index] };
        });
      }

      return {
        TITLE: will.TITLE,
        CONTENT: will.CONTENT,
        THUMBNAIL: will.THUMBNAIL,
        EDIT_DATE: will.EDIT_DATE,
        REG_DATE: will.REG_DATE,
        IS_PRIVATE: will.IS_PRIVATE,
        IS_DELETE: will.IS_DELETE,
        MEM_IDX: will.MEM_IDX,
        CONTENT_TYPE: will.CONTENT_TYPE,
        WILL_ID: will.WILL_ID,
        ANSWER_LIST: answer_list,
      };
    });

    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      rows,
    );
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

  try {
    const will = await willDao.getWill(parameter);
    let answer_list = [];
    if (will.QS_ESSAY_IDX && will.QS_IDX && will.QS_ESSAY_ANS) {
      const qsEssayIdx = will.QS_ESSAY_IDX.split(',').map((qsEssayIdx) => {
        return { question_essay_index: qsEssayIdx };
      });
      const qsIndex = will.QS_IDX.split(',').map((qsIdx) => {
        return { question_index: qsIdx };
      });
      const qsEssayAns = will.QS_ESSAY_ANS.split(',').map((qsAns) => {
        return { question_answer: qsAns };
      });
      answer_list = qsIndex.map((item, index) => {
        return { ...item, ...qsEssayAns[index], ...qsEssayIdx[index] };
      });
    }
    will.ANSWER_LIST = answer_list;

    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      will,
    );

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

router.get('/getWillList', async (req, res) => {
  try {
    const willInfo = await willDao.getWillList();
    const rows = helpers.makePaginate(req, willInfo);

    rows.willList = rows.willList.map((will) => {
      let answer_list = [];
      if (will.QS_IDX && will.QS_ESSAY_ANS) {
        const qsIndex = will.QS_IDX.split(',').map((qsIdx) => {
          return { question_index: qsIdx };
        });
        const qsEssayAns = will.QS_ESSAY_ANS.split(',').map((qsAns) => {
          return { question_answer: qsAns };
        });
        answer_list = qsIndex.map((item, index) => {
          return { ...item, ...qsEssayAns[index] };
        });
      }

      return {
        TITLE: will.TITLE,
        CONTENT: will.CONTENT,
        THUMBNAIL: will.THUMBNAIL,
        EDIT_DATE: will.EDIT_DATE,
        REG_DATE: will.REG_DATE,
        IS_PRIVATE: will.IS_PRIVATE,
        IS_DELETE: will.IS_DELETE,
        MEM_IDX: will.MEM_IDX,
        CONTENT_TYPE: will.CONTENT_TYPE,
        WILL_ID: will.WILL_ID,
        ANSWER_LIST: answer_list,
      };
    });

    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      rows,
    );

    //responseData

    //"QS_IDX": "1,2,3,4,5,6,7",
    //"QS_ESSAY_ANS": "TEST 1,TEST 2,TEST 3,TEST 4,TEST 5,TEST 6,TEST 7"

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
router.post('/insertWill', authMiddleware, async (req, res) => {
  const parameter = {
    title: req.body.title,
    content: req.body.content,
    content_type: req.body.content_type,
    thumbnail: req.body.thumbnail,
    mem_idx: req.body.mem_idx,
    will_id: req.body.will_id,
    is_private: req.body.is_private,
    content_type: req.body.content_type,
    answer_list: req.body?.answer_list,
  };
  try {
    const willInfo = await willDao.insertWill(parameter);
    const responseData = helpers.returnResponse(
      API_CODE.SUCCESS,
      resMessage.SUCCESS,
      willInfo,
    );

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
//수정
router.post('/updateWill', authMiddleware, async (req, res) => {
  const parameter = {
    title: req.body.title,
    content: req.body.content,
    content_type: req.body.content_type,
    thumbnail: req.body.thumbnail,
    mem_idx: req.body.mem_idx,
    will_id: req.body.will_id,
    is_private: req.body.is_private,
    content_type: req.body.content_type,
    answer_list: req.body?.answer_list,
  };
  try {
    const willInfo = await willDao.updateWill(parameter);
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
router.post('/deleteWill', authMiddleware, async (req, res) => {
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

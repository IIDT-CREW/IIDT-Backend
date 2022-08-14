// localStorage, sessionStorage 이름
const STORAGE_NAME = {
  USER: 'NFT-FRIENDS-USER-INFO',
};

const API_CODE = {
  SUCCESS: '0000', // 성공

  // 입력 파라미터 검증 실패 및 파싱 오류
  INVALID_REQUEST_FORMAT: '1000', // 요청값 유효하지 않음
  REQUEST_DEFICIENT: '1001', // 필수 요청 항목 누락
  REQUEST_NOT_SUPPORT: '1002', // 지원하지 않은 항목
  UNDEFINED_VALUE: '1003', // 정의되지 않은 구분(타입)값
  UNKNOWN_INTERFACE_ID: '1004', // 알 수 없는 인터페이스 아이디
  UNKNOWN_MAIN_MODULE_ID: '1005', // 알 수 없는 메인 모듈(메뉴) 아이디
  UNKNOWN_SUB_MODULE_ID: '1006', // 알 수 없는 서브 모듈(메뉴) 아이디
  INVALID_INTERFACE_ID: '1007', // 유효하지 않은 인터페이스 아이디
  INVALID_INTERFACE_VERSION: '1008', // 유효하지 않은 인터페이스 버전
  INVALID_MAIN_MODULE_ID: '1009', // 유효하지 않은 메인 모듈 아이디
  INVALID_SUB_MODULE_ID: '1010', // 유효하지 않은 서브 모듈 아이디
  BAD_DATA_TYPE: '1011', // 잘못된 데이터 타입
  REQUEST_VALUE_IS_EMPTY: '1012', // 필수 요청 항목 누락 (빈스트링)

  // 정책 및 로직 수행 시 발생하는 오류
  INVALID_INDEX_ID: '2001', // 유효하지 않은 인덱스 아이디
  INVALID_STANDBY_INDEX_ID: '2002', // 유효하지 않은 예비 인덱스 아이디
  NOT_MAPPING_MENU_INDEX: '2003', // 인덱스와 매핑되어 있지 않은 메뉴 아이디
  INVALID_MENU_ID: '2004', // 유효하지 않은 메뉴 아이디
  NOT_MAPPING_MENU_BLOCK: '2005', // 블럭과 매핑되어 있지 않은 메뉴 아이디
  INVALID_BLOCK_ID: '2006', // 유효하지 않은 블럭 아이디
  DUPLICATE_SORT_ORDER: '2007', // 중복된 정렬 순서
  INVALID_BASIC_CODE_NAME: '2008', // 유효하지 않은 기초 코드 명
  INVALID_COMMON_GROUP_CODE: '2009', // 유효하지 않은 공통 그룹 코드

  // 저장소(Database, File 등…) 연동 시 발생하는 오류
  DATABASE_CONNECTION_ERROR: '3000', // Database 접속 실패
  SQL_EXCEPTION: '3001', // SQL 오류
  DATA_IS_NULL: '3005', // 데이터 조회 후 응답값이 NULL인 경우
  DB_SELECT_FAILED: '3006', // DB 조회 실패
  DB_UPDATE_FAILED: '3007', // DB UPDATE 실패
  DB_INSERT_FAILED: '3006', // DB INSERT 실패
  DB_DELETE_FAILED: '3007', // DB 삭제 실패
  BAD_SQL_GRAMMAR: '3008', // 잘못된 SQL 문법

  // 사용자 관련 에러코드
  UNKNOWN_FAILURE_LOGIN: '4000', //  알수 없는 이유로 로그인에 실패하였습니다. 관리자에게 문의하세요
  INVALID_USER: '4001', // 해당 사용자 존재하지 않음
  FAILURE_USER_AUTH: '4002', // 사용자 인증 실패
  NOT_EXIST_THE_USER_ROLES: '4003', //  사용자 권한이 존재하지 않음
  BAD_CREDENTIAL: '4004', // 아이디나 비밀번호가 맞지 않습니다. 다시 확인해 주십시오
  ACCOUNT_DISABLED: '4005', // 계정이 비활성화 되었습니다. 관리자에게 문의하세요
  CREDENTIAL_EXPIRED: '4006', //  토큰 유효기간이 만료 되었습니다
  INVALID_TOKEN: '4007', // 유효하지 않은 토큰
  ACCESS_DENIED: '4008', // 접근권한이 없습니다
  DUPLICATE_USER: '4009', // 중복된 사용자가 존재합니다.
  INVALID_SIGNATURE: '4010', // 기타 알수 없는 이유의 유효하지 않은 토큰
  BLACKLIST_TOKEN: '4011', // 블랙리스트 토큰
  BAD_USER_STATUS: '4012', //  유효하지 않은 회원 상태 (정지사용자)

  // 콘텐츠 상태 관련 오류 (Meta)
  INVALID_CONTENTS: '5000', // 유효하지 않은 콘텐츠 입니다.

  // 외부 연동 시스템 통신 및 연동 시 발생하는 오류
  HTTP_STATUS_NOT_OK: '6000', // HTTP Status 오류
  HTTP_HOST_CONNECTION_REFUSED: '6001', // HTTP Host 연결이 실패하였습니다.
  HTTP_UNEXPECTED_CONTENT_TYPE: '6002', // 예상치 못한 Content Type
  HTTP_CONNECTION_TIMED_OUT: '6003', // HTTP Connection Timeout
  IO_EXCEPTION: '6004', // IO Exception
  ELASTICSEARCH_ERROR: '6005', // ElasticSearch Error

  // 기타
  INTERNAL_ERROR: '9000', // 내부 처리 오류
};

module.exports = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  DB_ERROR: 600,
  STORAGE_NAME,
  API_CODE,
};

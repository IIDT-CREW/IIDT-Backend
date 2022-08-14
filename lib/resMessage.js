module.exports = {
  SUCCESS: '성공', // 성공

  // 입력 파라미터 검증 실패 및 파싱 오류
  INVALID_REQUEST_FORMAT: '요청값 유효하지 않음', // 요청값 유효하지 않음
  REQUEST_DEFICIENT: '필수 요청 항목 누락', // 필수 요청 항목 누락
  REQUEST_NOT_SUPPORT: '지원하지 않은 항목', // 지원하지 않은 항목
  UNDEFINED_VALUE: '정의되지 않은 구분(타입)값', // 정의되지 않은 구분(타입)값
  UNKNOWN_INTERFACE_ID: '알 수 없는 인터페이스 아이디', // 알 수 없는 인터페이스 아이디
  UNKNOWN_MAIN_MODULE_ID: '알 수 없는 메인 모듈(메뉴) 아이디', // 알 수 없는 메인 모듈(메뉴) 아이디
  UNKNOWN_SUB_MODULE_ID: '알 수 없는 서브 모듈(메뉴) 아이디', // 알 수 없는 서브 모듈(메뉴) 아이디
  INVALID_INTERFACE_ID: '유효하지 않은 인터페이스 아이디', // 유효하지 않은 인터페이스 아이디
  INVALID_INTERFACE_VERSION: '유효하지 않은 인터페이스 버전', // 유효하지 않은 인터페이스 버전
  INVALID_MAIN_MODULE_ID: '유효하지 않은 메인 모듈 아이디', // 유효하지 않은 메인 모듈 아이디
  INVALID_SUB_MODULE_ID: '유효하지 않은 서브 모듈 아이디', // 유효하지 않은 서브 모듈 아이디
  BAD_DATA_TYPE: '잘못된 데이터 타입', // 잘못된 데이터 타입
  REQUEST_VALUE_IS_EMPTY: '필수 요청 항목 누락 (빈스트링)', // 필수 요청 항목 누락 (빈스트링)

  // 정책 및 로직 수행 시 발생하는 오류
  INVALID_INDEX_ID: '유효하지 않은 인덱스 아이디', // 유효하지 않은 인덱스 아이디
  INVALID_STANDBY_INDEX_ID: '유효하지 않은 예비 인덱스 아이디', // 유효하지 않은 예비 인덱스 아이디
  NOT_MAPPING_MENU_INDEX: '인덱스와 매핑되어 있지 않은 메뉴 아이디', // 인덱스와 매핑되어 있지 않은 메뉴 아이디
  INVALID_MENU_ID: '유효하지 않은 메뉴 아이디', // 유효하지 않은 메뉴 아이디
  NOT_MAPPING_MENU_BLOCK: '블럭과 매핑되어 있지 않은 메뉴 아이디', // 블럭과 매핑되어 있지 않은 메뉴 아이디
  INVALID_BLOCK_ID: '유효하지 않은 블럭 아이디', // 유효하지 않은 블럭 아이디
  DUPLICATE_SORT_ORDER: '중복된 정렬 순서', // 중복된 정렬 순서
  INVALID_BASIC_CODE_NAME: '유효하지 않은 기초 코드 명', // 유효하지 않은 기초 코드 명
  INVALID_COMMON_GROUP_CODE: '유효하지 않은 공통 그룹 코드', // 유효하지 않은 공통 그룹 코드

  // 저장소(Database, File 등…) 연동 시 발생하는 오류
  DATABASE_CONNECTION_ERROR: 'Database 접속 실패', // Database 접속 실패
  SQL_EXCEPTION: 'SQL 오류', // SQL 오류
  DATA_IS_NULL: '데이터 조회 후 응답값이 NULL인 경우', // 데이터 조회 후 응답값이 NULL인 경우
  DB_SELECT_FAILED: 'DB 조회 실패', // DB 조회 실패
  DB_UPDATE_FAILED: 'DB UPDATE 실패', // DB UPDATE 실패
  DB_INSERT_FAILED: 'DB INSERT 실패', // DB INSERT 실패
  DB_DELETE_FAILED: 'DB 삭제 실패', // DB 삭제 실패
  BAD_SQL_GRAMMAR: '잘못된 SQL 문법', // 잘못된 SQL 문법

  // 사용자 관련 에러코드
  UNKNOWN_FAILURE_LOGIN:
    '알수 없는 이유로 로그인에 실패하였습니다. 관리자에게 문의하세요', //  알수 없는 이유로 로그인에 실패하였습니다. 관리자에게 문의하세요
  INVALID_USER: '해당 사용자 존재하지 않음', // 해당 사용자 존재하지 않음
  FAILURE_USER_AUTH: '사용자 인증 실패', // 사용자 인증 실패
  NOT_EXIST_THE_USER_ROLES: '사용자 권한이 존재하지 않음', //  사용자 권한이 존재하지 않음
  BAD_CREDENTIAL: '아이디나 비밀번호가 맞지 않습니다. 다시 확인해 주십시오', // 아이디나 비밀번호가 맞지 않습니다. 다시 확인해 주십시오
  ACCOUNT_DISABLED: '계정이 비활성화 되었습니다. 관리자에게 문의하세요', // 계정이 비활성화 되었습니다. 관리자에게 문의하세요
  CREDENTIAL_EXPIRED: '토큰 유효기간이 만료 되었습니다', //  토큰 유효기간이 만료 되었습니다
  INVALID_TOKEN: '유효하지 않은 토큰', // 유효하지 않은 토큰
  ACCESS_DENIED: '접근권한이 없습니다', // 접근권한이 없습니다
  DUPLICATE_USER: '중복된 사용자가 존재합니다.', // 중복된 사용자가 존재합니다.
  INVALID_SIGNATURE: '기타 알수 없는 이유의 유효하지 않은 토큰', // 기타 알수 없는 이유의 유효하지 않은 토큰
  BLACKLIST_TOKEN: '블랙리스트 토큰', // 블랙리스트 토큰
  BAD_USER_STATUS: '유효하지 않은 회원 상태 (정지사용자)', //  유효하지 않은 회원 상태 (정지사용자)

  // 콘텐츠 상태 관련 오류 (Meta)
  INVALID_CONTENTS: '유효하지 않은 콘텐츠 입니다.', // 유효하지 않은 콘텐츠 입니다.

  // 외부 연동 시스템 통신 및 연동 시 발생하는 오류
  HTTP_STATUS_NOT_OK: 'HTTP Status 오류', // HTTP Status 오류
  HTTP_HOST_CONNECTION_REFUSED: 'HTTP Host 연결이 실패하였습니다.', // HTTP Host 연결이 실패하였습니다.
  HTTP_UNEXPECTED_CONTENT_TYPE: ' 예상치 못한 Content Type', // 예상치 못한 Content Type
  HTTP_CONNECTION_TIMED_OUT: 'HTTP Connection Timeout', // HTTP Connection Timeout
  IO_EXCEPTION: 'IO Exception', // IO Exception
  // 기타
  INTERNAL_ERROR: '내부 처리 오류', // 내부 처리 오류
};

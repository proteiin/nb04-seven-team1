import express from 'express';

const router = express.Router({ mergeParams: true });

export default (userController, userValidator) => {
  router
    .route('/')
    .post(
      userValidator.validateNickname,
      userValidator.validatePassword,
      userValidator.checkDuplicateNickname,
      userController.groupParticipation,
    )
    .delete(
      userValidator.validateNickname,
      userValidator.validatePassword,
      userController.groupLeave,
    );
  return router; // 설정이 완료된 라우터 반환
};

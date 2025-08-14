import { UsersRepository } from '../repository/user-repository.js';

export class UserValidator {
  constructor() {
    this.usersRepository = new UsersRepository();
  }
  checkDuplicateNickname = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { nickname } = req.body;

      const numericGroupId = Number(groupId);
      if (Number.isNaN(numericGroupId)) {
        return res.status(400).json({
          path: 'groupId',
          message: 'group_id is unvalidated',
        });
      }

      const nicknameDuplicated = await usersRepository.findByNickname(
        nickname,
        numericGroupId,
      );

      if (nicknameDuplicated) {
        return res.status(409).json({
          path: 'nickname',
          message: 'nickname is duplicated',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  checkNullNickname = async (req, res, next) => {
    try {
      const { nickname } = req.body;

      if (!nickname) {
        return res.status(400).json({
          path: 'nickname',
          message: 'nickname is required',
        });
      }
      if (nickname.trim().length === 0) {
        return res.status(400).json({
          path: 'nickname',
          message: 'nickname can not be just blank',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  // 비밀번호 빈 칸, 공백 확인
  checkNullPassword = async (req, res, next) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          path: 'password',
          message: 'password is required',
        });
      }
      if (password.trim().length === 0) {
        return res.status(400).json({
          path: 'password',
          message: 'password can not be just blank',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

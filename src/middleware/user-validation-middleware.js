import { UserRepository } from '../repository/user-repository.js';

export class UserValidator {
  constructor(userRepository) {
    this.userRepository = userRepository;
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

      const nicknameDuplicated = await this.userRepository.findByNickname(
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

  validateNickname = async (req, res, next) => {
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

      // 닉네임 최소 길이 검사
      if (nickname.length < 3) {
        return res.status(400).json({
          path: 'nickname',
          message: 'nickname must be at least 3 characters long',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  // 비밀번호 확인
  validatePassword = async (req, res, next) => {
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

      if (password.length < 8) {
        return res.status(400).json({
          path: 'password',
          message: 'password must be at least 8 characters long',
        });
      }
      if (password.length > 18) {
        return res.status(400).json({
          path: 'password',
          message: 'password must be at most 18 characters long',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

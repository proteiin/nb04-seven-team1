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
        const error = new Error('group_id is unvalidated');
        error.statusCode = 400;
        error.path = 'groupId';
        return next(error);
      }

      const nicknameDuplicated = await this.userRepository.findUser({
        group_id: numericGroupId,
        nickname,
      });

      if (nicknameDuplicated) {
        const error = new Error('nickname is duplicated');
        error.statusCode = 409;
        error.path = 'nickname';
        return next(error);
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
        const error = new Error('nickname is require');
        error.statusCode = 400;
        error.path = 'nickname';
        return next(error);
      }
      if (nickname.trim().length === 0) {
        const error = new Error('nickname can not be just blank');
        error.statusCode = 400;
        error.path = 'nickname';
        return next(error);
      }

      // 닉네임 최소 길이 검사
      if (nickname.length < 3) {
        const error = new Error('nickname must be at least 3 characters long');
        error.statusCode = 400;
        error.path = 'nickname';
        return next(error);
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
        const error = new Error('password is required');
        error.statusCode = 400;
        error.path = 'password';
        return next(error);
      }
      if (password.trim().length === 0) {
        const error = new Error('password can not be just blank');
        error.statusCode = 400;
        error.path = 'password';
        return next(error);
      }

      if (password.length < 8) {
        const error = new Error('password must be at least 8 characters long');
        error.statusCode = 400;
        error.path = 'password';
        return next(error);
      }
      if (password.length > 18) {
        const error = new Error('password must be at most 18 characters long');
        error.statusCode = 400;
        error.path = 'password';
        return next(error);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

import { UsersRepository } from '../repository/users-repository.js';

const usersRepository = new UsersRepository();

export async function checkDuplicateNickname(req, res, next) {
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
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

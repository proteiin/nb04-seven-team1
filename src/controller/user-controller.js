import userService from '../service/user-service.js';

export const groupParticipation = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { nickname, password } = req.body;

    const result = await userService.addParticipantToGroup(
      nickname,
      password,
      groupId,
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const groupLeave = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { nickname, password } = req.body;

    const result = await userService.leaveParticipantFromGroup(
      nickname,
      password,
      groupId,
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

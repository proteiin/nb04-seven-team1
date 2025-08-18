export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  groupParticipation = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { nickname, password } = req.body;

      const result = await this.userService.addParticipantToGroup(
        nickname,
        password,
        Number(groupId),
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  groupLeave = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { nickname, password } = req.body;

      const result = await this.userService.leaveParticipantFromGroup(
        nickname,
        password,
        Number(groupId),
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

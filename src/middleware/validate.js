export function validateGroupId(req, res, next) {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'groupId must be integer' });
  }
  req.groupId = groupId
  next();
}

export function validateTagId(req, res, next) {
  const tagId = parseInt(req.params.tagId, 10);

  if (isNaN(tagId)) {
    return res.status(400).json({ error: 'tagId must be integer' });
  }
  next();
}

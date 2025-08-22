export function errorHandler(err, req, res, next) {
  const status = err.status;
  console.error('Error:', err);
  console.error('Status:', status);

  if (status === 400) {
    return res.status(status).json({ error: '잘못된 요청입니다.' });
  } else if (status === 404 || err.code === 'P2025') {
    return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
  } else {
    return res.status(500).json({ error: '서버 오류' });
  }
}

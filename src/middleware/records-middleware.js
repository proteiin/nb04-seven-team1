export const validateGroupId = (req, res, next) => {
    const { groupId } = req.params;
    if (isNaN(parseInt(groupId, 10))) {
        return res.status(400).json({ message: 'URL 경로 그룹 ID가 유효하지 않습니다.' })
    }
    
    next();
};

export const validateRecordBody = (req, res, next) => {
    const { authorNickname, authorPassword, exerciseType, time, distance } = req.body;

    if (!authorNickname || !authorPassword || !exerciseType || time === undefined || time === null) {
        return res.status(400).json({ message: '닉네임, 비밀번호, 운동 종류와 시간은 필수 항목입니다.'});
    }

    const validExerciseTypes = ['run', 'bike', 'swim'];
    if (!validExerciseTypes.includes(exerciseType)) {
        return res.status(400).json({ message: "운동 종류는 '러닝', '사이클링', '수영' 중 하나여야 합니다."
        })
    }
     

    if (typeof time !== 'number' || time <= 0) {
        return res.status(400).json({ message: '운동 시간은 0보다 커야합니다.'});
    }

    if (distance !== undefined && typeof distance !== 'number') {
        return res.status(400).json({ message: '운동 거리는 숫자로 입력해야합니다.'});
    }

    next();
};
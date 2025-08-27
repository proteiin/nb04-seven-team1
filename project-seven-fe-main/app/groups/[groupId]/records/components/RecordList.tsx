'use client';

import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useInView } from 'react-intersection-observer';
import { Record } from '@/types/entities';
import { PaginationQuery } from '@/types/pagination';
import { getRecordsAction } from '../actions';
import styles from './RecordList.module.css';
import RecordListItem from './RecordListItem';

const cx = classNames.bind(styles);

const RecordList = ({
  groupId,
  paginationQuery,
  initialValues = [],
  total,
}: {
  groupId: number;
  paginationQuery: PaginationQuery;
  initialValues: Record[];
  total: number;
}) => {
  const [records, setRecords] = useState(initialValues);
  const [page, setPage] = useState(paginationQuery?.page ?? 1);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const loadMore = useCallback(async () => {
    const { data: next } = await getRecordsAction(groupId, {
      ...paginationQuery,
      page: page + 1,
    });
    setRecords((prev) => [...prev, ...next]);
    setPage(page + 1);
  }, [groupId, paginationQuery, page]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    setRecords(initialValues);
    setPage(paginationQuery?.page ?? 1);
  }, [initialValues, paginationQuery]);

  const hasNext = records.length < total;

  return (
    <div className={cx('recordList')}>
      {records.map((record) => (
        <RecordListItem key={record.id} record={record} />
      ))}
      {hasNext && <div ref={ref} />}
    </div>
  );
};

export default RecordList;

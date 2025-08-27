'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import { useInView } from 'react-intersection-observer';
import { Group } from '@/types/entities';
import { PaginationQuery } from '@/types/pagination';
import { LinkButton } from '@/lib/components/Button';
import Dropdown from '@/lib/components/Dropdown';
import Input from '@/lib/components/Input';
import { DEFAULT_GROUPS_PAGINATION_QUERY } from '@/lib/api';
import GroupListItem from './GroupListItem';
import { getGroupsAction } from '../actions';
import styles from './GroupList.module.css';

const cx = classNames.bind(styles);

const GroupListHeader = ({
  query: initialQuery = DEFAULT_GROUPS_PAGINATION_QUERY,
}: {
  query: PaginationQuery;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState<PaginationQuery>(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get('search') as string;
    setQuery((prev) => ({
      ...prev,
      search,
    }));
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== '')
    );
    router.push(`?${urlSearchParams.toString()}`);
  }, [router, query]);

  return (
    <div className={cx('listHeader')}>
      <h2 className={cx('title')}>진행 중인 그룹</h2>
      <div className={cx('actions')}>
        <form onSubmit={handleSubmit}>
          <Input
            className={cx('search')}
            name="search"
            id="search"
            search
            placeholder="이름으로 검색하기"
          />
        </form>

        <Dropdown
          className={cx('orderBy')}
          value={query.orderBy}
          onChange={(value) =>
            setQuery((prev) => ({ ...prev, orderBy: value }))
          }
          options={[
            { label: '최신순', value: 'createdAt' },
            { label: '참여자 수', value: 'participantCount' },
            { label: '좋아요 수', value: 'likeCount' },
          ]}
        />
        <LinkButton appearance="minimal" href="/groups/new">
          + 새 그룹 만들기
        </LinkButton>
      </div>
    </div>
  );
};

const GroupList = ({
  initialValues = [],
  paginationQuery,
  total,
}: {
  initialValues: Group[];
  paginationQuery: PaginationQuery;
  total: number;
}) => {
  const [groups, setGroups] = useState<Group[]>(initialValues);
  const [page, setPage] = useState(paginationQuery?.page ?? 1);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(
    async () => {
      setIsLoading(true);
      const { data: next } = await getGroupsAction({
        ...paginationQuery,
        page: page + 1,
      });
      setGroups((prev) => [...prev, ...next]);
      setPage(page + 1);
      setIsLoading(false);
    },
    [paginationQuery, page]
  );

  useEffect(() => {
    if (inView && !isLoading) {
      loadMore();
    }
  }, [inView, loadMore, isLoading]);

  useEffect(() => {
    setGroups(initialValues);
    setPage(paginationQuery?.page ?? 1);
  }, [initialValues, paginationQuery]);

  const hasNext = groups.length < total;

  return (
    <div className={cx('container')}>
      <GroupListHeader query={paginationQuery} />
      <ul className={cx('list')}>
        {groups.map((group) => (
          <li key={group.id}>
            <GroupListItem group={group} />
          </li>
        ))}
      </ul>
      {hasNext && <div ref={ref} />}
    </div>
  );
};

export default GroupList;

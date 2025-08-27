'use client';

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaginationQuery } from '@/types/pagination';
import Input from '@/lib/components/Input';
import { LinkButton } from '@/lib/components/Button';
import Dropdown from '@/lib/components/Dropdown';
import { DEFAULT_RECORDS_PAGINATION_QUERY } from '@/lib/api';
import styles from './RecordTabHeader.module.css';

const cx = classNames.bind(styles);

const RecordTabHeader = ({
  groupId,
  recordsTotal,
  initialQuery = DEFAULT_RECORDS_PAGINATION_QUERY,
}: {
  groupId: number;
  recordsTotal: number;
  initialQuery: PaginationQuery;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState<PaginationQuery>(initialQuery);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get('search') as string;
    setQuery({ ...query, search });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== '')
    );
    router.push(`/groups/${groupId}/records?${searchParams.toString()}`);
  }, [router, groupId, query]);

  return (
    <div className={cx('container')}>
      <div className={cx('total')}>총 {recordsTotal}개의 기록</div>
      <form onSubmit={handleSearch}>
        <Input
          className={cx('search')}
          search
          id="search"
          name="search"
          type="text"
          defaultValue={query.search}
          placeholder="닉네임으로 검색하기"
        />
      </form>

      <Dropdown
        className={cx('orderBy')}
        options={[
          { label: '최신순', value: 'createdAt' },
          { label: '운동 시간', value: 'time' },
        ]}
        value={query.orderBy}
        onChange={(value) => setQuery({ ...query, orderBy: value })}
      />
      <LinkButton appearance="minimal" href={`/groups/${groupId}/records/new`}>
        + 기록하기
      </LinkButton>
    </div>
  );
};

export default RecordTabHeader;

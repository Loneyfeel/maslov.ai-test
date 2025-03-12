'use client';
import { RepoCard } from '@/entities/repositories';
import { useRepositoriesByOwnerQuery } from '@/entities/repositories/gql/queries/repositoriesByOwner.graphql';
import { Input } from '@/shared/components/ui/Input';
import { useState, useCallback } from 'react';
import { DataListController } from '@/shared/components/ui/DataListController';

const PAGE_SIZE = 10;

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');

  const { refetch } = useRepositoriesByOwnerQuery({
    variables: {
      login,
      first: PAGE_SIZE,
      after: null
    },
    notifyOnNetworkStatusChange: true,
    skip: !login,
  });

  const fetchRepositories = useCallback(async ({ first, after }: { first: number; after: string | null }) => {
    try {
      if (!login) {
        return { items: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
      }

      const { data: newData } = await refetch({
        login,
        first,
        after,
      });

      if (!newData?.repositoryOwner) {
        return { items: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
      }

      return {
        items: newData.repositoryOwner.repositories.nodes?.filter(Boolean) || [],
        pageInfo: newData.repositoryOwner.repositories.pageInfo,
        totalCount: newData.repositoryOwner.repositories.totalCount || 0,
      };
    } catch (error) {
      console.error('Ошибка при загрузке репозиториев:', error);
      return { items: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
    }
  }, [login, refetch]);

  const renderRepo = useCallback((repo: any) => (
    <RepoCard key={repo.id} repo={repo} />
  ), []);

  return (
    <div className="flex flex-col gap-8 w-full max-w-prose">
      <Input
        {...{
          name: 'login',
          label: 'Логин GitHub',
          placeholder: 'Введите логин для поиска репозиториев',
          value: login,
          onChange: e => setLogin(e.target.value),
        }}
      />

      {login && (
        <DataListController
          fetchFunction={fetchRepositories}
          pageSize={PAGE_SIZE}
          renderItem={renderRepo}
          emptyMessage="Репозитории не найдены"
          allowToggle={true}
          defaultMode='pagination'
        />
      )}
    </div>
  );
};
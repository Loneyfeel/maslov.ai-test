import * as Types from '../../../../__generated__/graphql';

import { gql } from '@apollo/client';
import { RepositoryFragmentDoc } from '../fragments/repository.graphql';
import * as Apollo from '@apollo/client';

const defaultOptions = {} as const;
export type RepositoriesByOwnerQueryVariables = Types.Exact<{
  login: Types.Scalars['String']['input'];
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type RepositoriesByOwnerQuery = {
  __typename?: 'Query';
  repositoryOwner?:
    | {
    __typename?: 'Organization';
    repositories: {
      totalCount: number;
      pageInfo: {
        endCursor?: string | null;
        hasNextPage: boolean;
      };
      __typename?: 'RepositoryConnection';
      nodes?: Array<{
        __typename: 'Repository';
        id: string;
        name: string;
        description?: string | null;
        url: any;
        updatedAt: any;
      } | null> | null;
    };
  }
    | {
    __typename?: 'User';
    repositories: {
      totalCount: number;
      pageInfo: {
        endCursor?: string | null;
        hasNextPage: boolean;
      };
      __typename?: 'RepositoryConnection';
      nodes?: Array<{
        __typename: 'Repository';
        id: string;
        name: string;
        description?: string | null;
        url: any;
        updatedAt: any;
      } | null> | null;
    };
  }
    | null;
};

export const RepositoriesByOwnerDocument = gql`
    query repositoriesByOwner($login: String!, $first: Int = 10, $after: String) {
        repositoryOwner(login: $login) {
            repositories(first: $first, after: $after) {
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
                nodes {
                    ...Repository
                }
            }
        }
    }
${RepositoryFragmentDoc}`;

/**
 * __useRepositoriesByOwnerQuery__
 *
 * To run a query within a React component, call `useRepositoriesByOwnerQuery` and pass it any options that fit your needs.
 * When your component renders, `useRepositoriesByOwnerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRepositoriesByOwnerQuery({
 *   variables: {
 *      login: // value for 'login'
 *   },
 * });
 */
export function useRepositoriesByOwnerQuery(
  baseOptions: Apollo.QueryHookOptions<
    RepositoriesByOwnerQuery,
    RepositoriesByOwnerQueryVariables
  > &
    (
      | {
      variables: RepositoriesByOwnerQueryVariables;
      skip?: boolean;
    }
      | { skip: boolean }
      )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    RepositoriesByOwnerQuery,
    RepositoriesByOwnerQueryVariables
  >(RepositoriesByOwnerDocument, options);
}

export function useRepositoriesByOwnerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RepositoriesByOwnerQuery,
    RepositoriesByOwnerQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RepositoriesByOwnerQuery,
    RepositoriesByOwnerQueryVariables
  >(RepositoriesByOwnerDocument, options);
}

export function useRepositoriesByOwnerSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
    RepositoriesByOwnerQuery,
    RepositoriesByOwnerQueryVariables
  >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    RepositoriesByOwnerQuery,
    RepositoriesByOwnerQueryVariables
  >(RepositoriesByOwnerDocument, options);
}

export type RepositoriesByOwnerQueryHookResult = ReturnType<
  typeof useRepositoriesByOwnerQuery
>;
export type RepositoriesByOwnerLazyQueryHookResult = ReturnType<
  typeof useRepositoriesByOwnerLazyQuery
>;
export type RepositoriesByOwnerSuspenseQueryHookResult = ReturnType<
  typeof useRepositoriesByOwnerSuspenseQuery
>;
export type RepositoriesByOwnerQueryResult = Apollo.QueryResult<
  RepositoriesByOwnerQuery,
  RepositoriesByOwnerQueryVariables
>;

import type { APIResponse, Tweet } from '../types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { client } from './api-client';

export const useScheduleTweet = () => {
  const queryClient = useQueryClient();
  return useMutation<APIResponse>((data) => client('/api/tweet', { data }), {
    onSuccess: () => {
      queryClient.invalidateQueries('scheduled-tweets');
    },
  });
};

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();
  return useMutation<APIResponse>(
    (id) => client(`/api/tweet/${id}`, { method: 'DELETE' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('scheduled-tweets');
      },
    }
  );
};

export const useScheduledTweets = () => {
  return useQuery<Tweet[], Error>('scheduled-tweets', () => client('/api/tweet'), {
    placeholderData: [],
    refetchInterval: 1000 * 30,
  });
};

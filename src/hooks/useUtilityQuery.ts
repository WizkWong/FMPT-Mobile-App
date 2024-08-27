import { InfiniteData, useQueryClient } from "@tanstack/react-query";

const useUtilityQuery = () => {
  const queryClient = useQueryClient();

  return { 
    resetInfiniteQueryPagination: (queryKey: string[]) => {
      queryClient.setQueryData(queryKey, (oldData: InfiniteData<any, any>) => {
        if (!oldData) return undefined;
    
        return {
          ...oldData,
          pages: oldData.pages.slice(0, 1),
          pageParams: oldData.pageParams.slice(0, 1),
        };
      });
    },
  }
}

export default useUtilityQuery


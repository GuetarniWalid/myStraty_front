import useSWR from "swr"

export function useUsersByAdmin () {
    const { data, error } = useSWR<PrivateUser[]>('admin/users')

    if(error) console.log(error);
    
  
    return {
      users: data,
      isLoading: !error && !data,
      isError: error
    }
  }
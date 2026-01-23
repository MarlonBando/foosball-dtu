import { useQuery } from '@tanstack/react-query';
import { getAllNationalities } from '../api/services/nationalityService';

export function useNationalities() {
  return useQuery({
    queryKey: ['nationalities'],
    queryFn: getAllNationalities,
  });
}

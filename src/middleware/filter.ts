import { FilterDTO } from '@types';

export const buildFilter = (query: FilterDTO, ignoreFields: string[] = []) => {
  return Object.keys(query)
    .filter((key) => query[key] && !ignoreFields.includes(key))
    ?.reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: { $regex: query[key], $options: 'i' },
        };
      },
      {
        active: true,
      },
    );
};

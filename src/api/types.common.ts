import {FEATURE, QUERY_KEY} from './constants';

enum Operator {
  IsNull = 'ISNULL',
  ILike = 'ILIKE',
  Like = 'LIKE',
  Equal = 'EQUAL',
  MoreThanOrEqual = 'MORETHANOREQUAL',
  MoreThan = 'MORETHAN',
  LessThanOrEqual = 'LESSTHANOREQUAL',
  LessThan = 'LESSTHAN',
  Not = 'NOT',
}

export interface Filter<Field> {
  field: keyof Field;
  operator: Operator;
  value: string;
}

export interface IParamsDefault<Field> {
  page?: number;
  take?: number;
  order?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  filter?: Filter<Field>[];
  optionKey?: {
    [key: string]: string;
  };
  q?: string;
}

export interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TResponseList<T> {
  data: T[];
  meta: Meta;
}

export interface IBaseUseInfinities<Params> {
  query_key: QUERY_KEY;
  params: Params;
  configApi: {
    feature: FEATURE;
    isPublic?: boolean;
    cacheTime?: number;
  };
}

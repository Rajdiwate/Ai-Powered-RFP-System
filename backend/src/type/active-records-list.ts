import { InferSelectModel, SQL } from 'drizzle-orm';
import { AnyPgTable } from 'drizzle-orm/pg-core';

export type ListActiveParams<TTable extends AnyPgTable> = {
  limit?: number;
  page?: number;
  predicate?: SQL;
  orderBy?: { column?: keyof TTable['_']['columns']; direction?: 'asc' | 'desc' };
};

export type ListActiveResult<TTable extends AnyPgTable> = {
  items: InferSelectModel<TTable>[] | [];
  total: number;
  page: number;
  size: number;
};

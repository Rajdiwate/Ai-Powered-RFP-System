import type { InferInsertModel, InferSelectModel, SQL } from 'drizzle-orm';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
} from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core';
import { IndexColumn } from 'drizzle-orm/pg-core';

import { AppError } from './app-error';
import { DBSchema, ListActiveParams, ListActiveResult } from '../type';

type StandardColumns = {
  id: AnyPgColumn;
  deletedAt?: AnyPgColumn;
  createdAt?: AnyPgColumn;
  updatedAt?: AnyPgColumn;
};

type RequireStandardCols<C> = C & StandardColumns;

const getAllColumns = <TTable extends AnyPgTable>(
  table: TTable
): RequireStandardCols<TTable['_']['columns']> => {
  return getTableColumns(table) as RequireStandardCols<TTable['_']['columns']>;
};

export class BaseRepository<TTable extends AnyPgTable> {
  private readonly cols: RequireStandardCols<TTable['_']['columns']>;

  constructor(
    private readonly db: NodePgDatabase<DBSchema>,
    private readonly table: TTable
  ) {
    // Drizzle-native columns with asserted standard keys
    this.cols = getAllColumns(table);
  }

  protected ctx(trx?: NodePgDatabase<DBSchema>): NodePgDatabase<DBSchema> {
    return trx ?? this.db;
  }

  private active() {
    return this.cols.deletedAt ? isNull(this.cols.deletedAt) : undefined;
  }

  private deleted() {
    return this.cols.deletedAt ? isNotNull(this.cols.deletedAt) : undefined;
  }

  // CREATE
  create = async (
    data: InferInsertModel<TTable>,
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>> => {
    const patch = {
      ...data,
      ...(this.cols.createdAt && { createdAt: new Date() }),
      ...(this.cols.updatedAt && { updatedAt: new Date() }),
    } as InferInsertModel<TTable>;

    const [row] = (await this.ctx(trx)
      .insert(this.table)
      .values(patch)
      .returning(this.cols)) as InferSelectModel<TTable>[];

    if (!row) {
      throw AppError.InternalServerError('Failed while creating record.');
    }

    return row;
  };

  createMany = async (
    data: InferInsertModel<TTable>[],
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>[]> => {
    const patch = data.map((item) => ({
      ...item,
      ...(this.cols.createdAt && { createdAt: new Date() }),
      ...(this.cols.updatedAt && { updatedAt: new Date() }),
    }));

    const rows = (await this.ctx(trx)
      .insert(this.table)
      .values(patch)
      .returning(this.cols)) as InferSelectModel<TTable>[];

    if (!rows) {
      throw AppError.InternalServerError('Failed while creating record.');
    }

    return rows;
  };

  upsert = async (
    data: InferInsertModel<TTable>,
    conflictColumns: (keyof TTable['_']['columns'])[],
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>> => {
    const [row] = (await this.ctx(trx)
      .insert(this.table)
      .values({
        ...data,
        ...(this.cols.createdAt && { createdAt: new Date() }),
        ...(this.cols.updatedAt && { updatedAt: new Date() }),
      } as any)
      .onConflictDoUpdate({
        target: conflictColumns.map(
          (col) => this.table[col as keyof typeof this.table]
        ) as IndexColumn[],
        set: {
          ...data,
          ...(this.cols.updatedAt && { updatedAt: new Date() }),
        } as any,
      })
      .returning()) as InferSelectModel<TTable>[];

    if (!row) {
      throw AppError.InternalServerError('Failed while upserting record.');
    }

    return row;
  };

  // READ
  getById = async (
    id: InferSelectModel<TTable>['id'],
    trx?: NodePgDatabase<DBSchema>,
    includeDeleted = false
  ): Promise<InferSelectModel<TTable> | null> => {
    const whereClause =
      includeDeleted || !this.active()
        ? eq(this.cols.id as AnyPgColumn, id as never)
        : and(eq(this.cols.id as AnyPgColumn, id as never), this.active());
    const rows = await this.ctx(trx)
      .select()
      .from(this.table as AnyPgTable)
      .where(whereClause)
      .limit(1);

    return (rows[0] as InferSelectModel<TTable>) ?? null;
  };

  // READ ALL
  getAll = async ({
    trx,
    params,
  }: {
    trx?: NodePgDatabase<DBSchema>;
    params?: ListActiveParams<TTable>;
  }): Promise<ListActiveResult<TTable>> => {
    let { limit, page, orderBy, predicate } = params ?? {};
    if (!limit) {
      limit = 50;
    }
    if (!page) {
      page = 1;
    }
    const offset = (page - 1) * limit;

    // Build conditions array for dynamic filtering
    const conditions: SQL[] = [];

    // Only apply active filter if the table has a deletedAt column
    const activeCondition = this.active();
    if (activeCondition) {
      conditions.push(activeCondition);
    }

    // Add search condition if provided
    if (predicate) {
      conditions.push(predicate);
    }

    // Build the main query
    const q = this.ctx(trx)
      .select()
      .from(this.table as AnyPgTable);

    // Apply all conditions
    if (conditions.length > 0) {
      q.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply pagination and ordering
    const defaultOrderBy = this.cols.createdAt ? 'createdAt' : 'id';
    const key = orderBy?.column ?? defaultOrderBy;
    const col = this.cols[key] as AnyPgColumn;
    const dir = orderBy?.direction ?? 'desc';

    const items =
      ((await q
        .orderBy(dir === 'desc' ? desc(col) : asc(col))
        .limit(limit)
        .offset(offset)) as unknown as InferSelectModel<TTable>[]) ?? [];

    // Build total count query with same conditions
    const totalQuery = this.ctx(trx)
      .select({ count: count() })
      .from(this.table as AnyPgTable);

    if (conditions.length > 0) {
      totalQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const totalRow = await totalQuery;
    const total = totalRow[0]?.count ?? 0;

    return {
      items,
      total,
      page,
      size: limit,
    };
  };

  // UPDATE
  updateById = async (
    id: InferSelectModel<TTable>['id'],
    patch: Partial<InferInsertModel<TTable>>,
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>> => {
    const update = {
      ...patch,
      ...(this.cols.updatedAt && { updatedAt: new Date() }),
    } as Partial<InferInsertModel<TTable>>;

    const [row] = (await this.ctx(trx)
      .update(this.table)
      .set(update)
      .where(and(eq(this.cols.id as AnyPgColumn, id as never), this.active()))
      .returning(this.cols)) as InferSelectModel<TTable>[];

    if (!row) {
      throw AppError.NotFoundError(`Error while updating record.`);
    }

    return row;
  };

  // SOFT DELETE / RESTORE / HARD DELETE
  softDelete = async (
    id: InferSelectModel<TTable>['id'],
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>> => {
    if (!this.cols.deletedAt) {
      throw new Error('Cannot soft delete: table does not have a deletedAt column.');
    }

    const updateData: Record<string, unknown> = {
      deletedAt: new Date(),
    };

    if (this.cols.updatedAt) {
      updateData.updatedAt = new Date();
    }

    const [row] = (await this.ctx(trx)
      .update(this.table)
      .set(updateData)
      .where(and(eq(this.cols.id as AnyPgColumn, id as never), this.active()))
      .returning(this.cols)) as InferSelectModel<TTable>[];

    return row ?? null;
  };

  restore = async (
    id: InferSelectModel<TTable>['id'],
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>> => {
    if (!this.cols.deletedAt) {
      throw new Error('Cannot restore: table does not have a deletedAt column.');
    }

    const updateData: Record<string, unknown> = {
      deletedAt: null,
    };

    if (this.cols.updatedAt) {
      updateData.updatedAt = new Date();
    }

    const [row] = (await this.ctx(trx)
      .update(this.table)
      .set(updateData)
      .where(and(eq(this.cols.id as AnyPgColumn, id as never), this.deleted()))
      .returning(this.cols)) as InferSelectModel<TTable>[];

    return row ?? null;
  };

  hardDelete = async (
    id: InferSelectModel<TTable>['id'],
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>> => {
    const [row] = (await this.ctx(trx)
      .delete(this.table)
      .where(eq(this.cols.id as AnyPgColumn, id as never))
      .returning(this.cols)) as InferSelectModel<TTable>[];

    return row ?? null;
  };

  hardDeleteMany = async (
    ids: InferSelectModel<TTable>['id'][],
    trx?: NodePgDatabase<DBSchema>
  ): Promise<InferSelectModel<TTable>[]> => {
    const rows = (await this.ctx(trx)
      .delete(this.table)
      .where(inArray(this.cols.id as AnyPgColumn, ids))
      .returning(this.cols)) as InferSelectModel<TTable>[];

    return rows;
  };
}

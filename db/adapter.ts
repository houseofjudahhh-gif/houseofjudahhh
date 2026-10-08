import { getTursoClient } from './turso';
import type { InArgs, InValue, InStatement } from '@libsql/client';

type QueryResult<T> = {
  results: T[];
  meta: { changes: number };
  success: boolean;
};

class PreparedQuery {
  constructor(
    private sql: string,
    private args: InValue[] = []
  ) {}

  bind(...args: InValue[]) {
    return new PreparedQuery(this.sql, args);
  }

  statement(): InStatement {
    return { sql: this.sql, args: this.args as InArgs };
  }

  async all<T = Record<string, unknown>>(): Promise<QueryResult<T>> {
    const result = await getTursoClient().execute(this.statement());
    return {
      results: result.rows as unknown as T[],
      meta: { changes: result.rowsAffected },
      success: true
    };
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    const result = await this.all<T>();
    return result.results[0] ?? null;
  }

  async run(): Promise<QueryResult<Record<string, unknown>>> {
    const result = await getTursoClient().execute(this.statement());
    return {
      results: result.rows as unknown as Record<string, unknown>[],
      meta: { changes: result.rowsAffected },
      success: true
    };
  }
}

export function database() {
  return {
    prepare(sql: string) {
      return new PreparedQuery(sql);
    },

    async batch<T = Record<string, unknown>>(queries: PreparedQuery[]) {
      const results = await getTursoClient().batch(
        queries.map(query => query.statement()),
        'write'
      );

      return results.map(result => ({
        results: result.rows as unknown as T[],
        meta: { changes: result.rowsAffected },
        success: true
      }));
    }
  };
}

import { createClient } from "./supabase/client";

export interface AuditLogEntry {
  id?: string;
  table_name: string;
  record_id: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  user_id: string;
  user_email?: string;
  changes?: Record<string, { old: any; new: any }>;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface AuditLogFilters {
  table_name?: string;
  record_id?: string;
  user_id?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export class AuditLogger {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    this.supabase = createClient();
  }

  async logChange(entry: AuditLogEntry): Promise<{ id: string; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from("audit_logs")
        .insert([
          {
            table_name: entry.table_name,
            record_id: entry.record_id,
            action: entry.action,
            user_id: entry.user_id,
            user_email: entry.user_email,
            changes: entry.changes || null,
            old_values: entry.old_values || null,
            new_values: entry.new_values || null,
            metadata: entry.metadata || null,
            ip_address: entry.ip_address || null,
            user_agent: entry.user_agent || null,
            created_at: entry.created_at || new Date().toISOString(),
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      return { id: data?.id || "" };
    } catch (error) {
      console.error("Failed to log audit change:", error);
      return { id: "", error };
    }
  }

  async logCreate(
    tableName: string,
    recordId: string,
    userId: string,
    newValues: Record<string, any>,
    userEmail?: string
  ): Promise<{ id: string; error?: any }> {
    return this.logChange({
      table_name: tableName,
      record_id: recordId,
      action: "INSERT",
      user_id: userId,
      user_email: userEmail,
      new_values: newValues,
    });
  }

  async logUpdate(
    tableName: string,
    recordId: string,
    userId: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    userEmail?: string
  ): Promise<{ id: string; error?: any }> {
    const changes: Record<string, { old: any; new: any }> = {};

    const allKeys = new Set([
      ...Object.keys(oldValues || {}),
      ...Object.keys(newValues || {}),
    ]);

    allKeys.forEach((key) => {
      const oldValue = oldValues?.[key];
      const newValue = newValues?.[key];

      if (oldValue !== newValue) {
        changes[key] = { old: oldValue, new: newValue };
      }
    });

    if (Object.keys(changes).length === 0) {
      return { id: "" };
    }

    return this.logChange({
      table_name: tableName,
      record_id: recordId,
      action: "UPDATE",
      user_id: userId,
      user_email: userEmail,
      changes,
      old_values: oldValues,
      new_values: newValues,
    });
  }

  async logDelete(
    tableName: string,
    recordId: string,
    userId: string,
    oldValues: Record<string, any>,
    userEmail?: string
  ): Promise<{ id: string; error?: any }> {
    return this.logChange({
      table_name: tableName,
      record_id: recordId,
      action: "DELETE",
      user_id: userId,
      user_email: userEmail,
      old_values: oldValues,
    });
  }

  async getAuditLog(filters: AuditLogFilters = {}): Promise<{
    logs: AuditLogEntry[];
    total: number;
    error?: any;
  }> {
    try {
      let query = this.supabase
        .from("audit_logs")
        .select("*", { count: "exact" });

      if (filters.table_name) {
        query = query.eq("table_name", filters.table_name);
      }

      if (filters.record_id) {
        query = query.eq("record_id", filters.record_id);
      }

      if (filters.user_id) {
        query = query.eq("user_id", filters.user_id);
      }

      if (filters.action) {
        query = query.eq("action", filters.action);
      }

      if (filters.date_from) {
        query = query.gte("created_at", filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte("created_at", filters.date_to);
      }

      const limit = filters.limit || 100;
      const offset = filters.offset || 0;

      query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        logs: data || [],
        total: count || 0,
      };
    } catch (error) {
      console.error("Failed to fetch audit log:", error);
      return { logs: [], total: 0, error };
    }
  }

  async getRecordHistory(tableName: string, recordId: string): Promise<{
    history: AuditLogEntry[];
    error?: any;
  }> {
    const result = await this.getAuditLog({
      table_name: tableName,
      record_id: recordId,
      limit: 100,
    });
    
    return {
      history: result.logs,
      error: result.error,
    };
  }

  async exportAuditLog(filters: AuditLogFilters = {}): Promise<AuditLogEntry[]> {
    const { logs, error } = await this.getAuditLog({
      ...filters,
      limit: 10000,
    });

    if (error) throw error;
    return logs;
  }
}

export const auditLogger = new AuditLogger();

export function createAuditMiddleware(tableName: string, userId?: string, userEmail?: string) {
  return {
    async onCreate(recordId: string, values: Record<string, any>) {
      return auditLogger.logCreate(tableName, recordId, userId || "", values, userEmail);
    },
    async onUpdate(recordId: string, oldValues: Record<string, any>, newValues: Record<string, any>) {
      return auditLogger.logUpdate(tableName, recordId, userId || "", oldValues, newValues, userEmail);
    },
    async onDelete(recordId: string, oldValues: Record<string, any>) {
      return auditLogger.logDelete(tableName, recordId, userId || "", oldValues, userEmail);
    },
  };
}

export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || "",
  };
}

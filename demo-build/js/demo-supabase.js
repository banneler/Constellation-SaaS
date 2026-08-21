(() => {
  const state = window.CONSTELLATION_DEMO_STATE;
  if (!state) throw new Error('Missing Constellation demo state.');

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const ensureTable = (name) => {
    if (!state.tables[name]) state.tables[name] = [];
    return state.tables[name];
  };

  class DemoQuery {
    constructor(tableName) {
      this.tableName = tableName;
      this.filters = [];
      this.orderBy = null;
      this.limitCount = null;
      this.rangeBounds = null;
      this.singleMode = false;
      this.maybeSingleMode = false;
      this.selectOptions = {};
      this.operation = 'select';
      this.payload = null;
    }

    select(_columns, options = {}) { this.selectOptions = options || {}; return this; }
    eq(field, value) { this.filters.push((row) => String(row?.[field]) === String(value)); return this; }
    neq(field, value) { this.filters.push((row) => String(row?.[field]) !== String(value)); return this; }
    in(field, values) { const set = new Set((values || []).map(String)); this.filters.push((row) => set.has(String(row?.[field]))); return this; }
    is(field, value) { this.filters.push((row) => row?.[field] === value); return this; }
    gte(field, value) { this.filters.push((row) => row?.[field] >= value); return this; }
    lte(field, value) { this.filters.push((row) => row?.[field] <= value); return this; }
    ilike(field, pattern) {
      const needle = String(pattern || '').replace(/%/g, '').toLowerCase();
      this.filters.push((row) => String(row?.[field] || '').toLowerCase().includes(needle));
      return this;
    }
    like(field, pattern) { return this.ilike(field, pattern); }
    or() { return this; }
    order(field, options = {}) { this.orderBy = { field, ascending: options.ascending !== false }; return this; }
    limit(count) { this.limitCount = count; return this; }
    range(from, to) { this.rangeBounds = { from, to }; return this; }
    single() { this.singleMode = true; return this; }
    maybeSingle() { this.maybeSingleMode = true; return this; }
    insert(payload) { this.operation = 'insert'; this.payload = payload; return this; }
    update(payload) { this.operation = 'update'; this.payload = payload; return this; }
    upsert(payload) { this.operation = 'upsert'; this.payload = payload; return this; }
    delete() { this.operation = 'delete'; return this; }

    then(resolve, reject) {
      return Promise.resolve(this.execute()).then(resolve, reject);
    }

    execute() {
      const table = ensureTable(this.tableName);
      if (this.operation === 'insert') return this.insertRows(table);
      if (this.operation === 'update') return this.updateRows(table);
      if (this.operation === 'upsert') return this.upsertRows(table);
      if (this.operation === 'delete') return this.deleteRows(table);
      return this.selectRows(table);
    }

    filteredRows(table) {
      let rows = table.filter((row) => this.filters.every((fn) => fn(row)));
      if (this.orderBy) {
        const { field, ascending } = this.orderBy;
        rows = [...rows].sort((a, b) => {
          const av = a?.[field];
          const bv = b?.[field];
          if (av === bv) return 0;
          return (av > bv ? 1 : -1) * (ascending ? 1 : -1);
        });
      }
      if (this.rangeBounds) rows = rows.slice(this.rangeBounds.from, this.rangeBounds.to + 1);
      if (Number.isFinite(this.limitCount)) rows = rows.slice(0, this.limitCount);
      return rows;
    }

    shape(rows) {
      const count = this.selectOptions.count === 'exact' ? rows.length : null;
      if (this.selectOptions.head === true) {
        return { data: null, error: null, count };
      }
      if (this.singleMode || this.maybeSingleMode) {
        return { data: rows[0] ? clone(rows[0]) : null, error: null, count };
      }
      return { data: clone(rows), error: null, count };
    }

    selectRows(table) {
      return this.shape(this.filteredRows(table));
    }

    insertRows(table) {
      const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = rows.map((row) => ({ id: row?.id ?? Date.now() + Math.floor(Math.random() * 10000), ...row }));
      table.push(...inserted);
      return this.shape(inserted);
    }

    updateRows(table) {
      const rows = this.filteredRows(table);
      rows.forEach((row) => Object.assign(row, this.payload || {}));
      return this.shape(rows);
    }

    upsertRows(table) {
      const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
      const saved = rows.map((incoming) => {
        const key = incoming.id != null ? 'id' : incoming.user_id != null ? 'user_id' : null;
        const existing = key ? table.find((row) => String(row[key]) === String(incoming[key])) : null;
        if (existing) {
          Object.assign(existing, incoming);
          return existing;
        }
        const created = { id: incoming.id ?? Date.now() + Math.floor(Math.random() * 10000), ...incoming };
        table.push(created);
        return created;
      });
      return this.shape(saved);
    }

    deleteRows(table) {
      const rows = this.filteredRows(table);
      rows.forEach((row) => {
        const index = table.indexOf(row);
        if (index >= 0) table.splice(index, 1);
      });
      return { data: clone(rows), error: null };
    }
  }

  function createClient() {
    return {
      auth: {
        async getUser() { return { data: { user: clone(state.user) }, error: null }; },
        async getSession() { return { data: { session: { user: clone(state.user), access_token: 'demo-local-token' } }, error: null }; },
        onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
        async signOut() { return { error: null }; }
      },
      from(tableName) { return new DemoQuery(tableName); },
      rpc(name, args = {}) {
        if (name === 'get_all_sequences_for_marketing') {
          const abm = (state.tables.sequences || []).map((row) => ({ ...row, sequence_type: 'abm' }));
          const marketing = (state.tables.marketing_sequences || []).map((row) => ({ ...row, sequence_type: 'marketing' }));
          return Promise.resolve({ data: clone([...abm, ...marketing]), error: null });
        }
        if (name === 'get_admin_users') {
          return Promise.resolve({ data: clone(state.tables.user_quotas || []), error: null });
        }
        if (name === 'get_admin_activity_log' || name === 'get_admin_script_logs') {
          return Promise.resolve({ data: [], error: null });
        }
        if (name === 'approve_pathfinder_candidate') {
          const candidates = ensureTable('pathfinder_candidates');
          const contacts = ensureTable('contacts');
          const candidate = candidates.find((row) => String(row.id) === String(args.p_candidate_id));
          if (!candidate) return Promise.resolve({ data: null, error: { message: 'Pathfinder candidate not found' } });
          if (!['pending', 'duplicate'].includes(candidate.status)) {
            return Promise.resolve({ data: null, error: { message: 'Candidate has already been reviewed' } });
          }

          const email = String(candidate.email_address || '').trim().toLowerCase();
          const existing = contacts.find((contact) => {
            if (String(contact.account_id) !== String(candidate.account_id)) return false;
            if (email && String(contact.email || '').trim().toLowerCase() === email) return true;
            return String(contact.first_name || '').trim().toLowerCase() === String(candidate.first_name || '').trim().toLowerCase()
              && String(contact.last_name || '').trim().toLowerCase() === String(candidate.last_name || '').trim().toLowerCase();
          });

          if (existing) {
            if (!existing.profile_url && candidate.profile_url) existing.profile_url = candidate.profile_url;
            Object.assign(candidate, {
              status: 'duplicate',
              crm_contact_id: existing.id,
              reviewed_by: state.user.id,
              reviewed_at: new Date().toISOString()
            });
            return Promise.resolve({ data: existing.id, error: null });
          }

          const created = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            user_id: candidate.user_id,
            account_id: candidate.account_id,
            first_name: candidate.first_name,
            last_name: candidate.last_name,
            name: [candidate.first_name, candidate.last_name].filter(Boolean).join(' '),
            title: candidate.title,
            email: candidate.email_address || '',
            phone: candidate.phone || '',
            profile_url: candidate.profile_url || null,
            reports_to: null,
            notes: 'Created from Pathfinder review.',
            last_saved: new Date().toISOString()
          };
          contacts.push(created);
          Object.assign(candidate, {
            status: 'approved',
            crm_contact_id: created.id,
            reviewed_by: state.user.id,
            reviewed_at: new Date().toISOString()
          });
          return Promise.resolve({ data: created.id, error: null });
        }
        if (name === 'reject_pathfinder_candidate') {
          const candidates = ensureTable('pathfinder_candidates');
          const candidate = candidates.find((row) => String(row.id) === String(args.p_candidate_id));
          if (!candidate) return Promise.resolve({ data: null, error: { message: 'Pathfinder candidate not found' } });
          if (candidate.status !== 'pending') {
            return Promise.resolve({ data: null, error: { message: 'Only pending candidates may be rejected' } });
          }
          Object.assign(candidate, {
            status: 'rejected',
            reviewed_by: state.user.id,
            reviewed_at: new Date().toISOString()
          });
          return Promise.resolve({ data: null, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      },
      functions: {
        async invoke(name, options = {}) {
          return { data: window.__constellationDemoApiResponse?.(name, options.body) || {}, error: null };
        }
      },
      storage: {
        from() {
          return {
            async download() { return { data: new Blob(['Demo attachment'], { type: 'text/plain' }), error: null }; },
            getPublicUrl(path) { return { data: { publicUrl: path } }; }
          };
        }
      }
    };
  }

  window.supabase = { createClient };
})();

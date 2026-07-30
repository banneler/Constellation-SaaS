(() => {
  const originalFetch = window.fetch.bind(window);

  function demoProspectEmail(body = {}) {
    const contactName = String(body.contactName || 'there').trim();
    const firstName = contactName.split(/\s+/)[0] || 'there';
    const accountName = String(body.accountName || 'your team').trim() || 'your team';

    return {
      subject: 'AI-guided outreach that improves with every response',
      body: `Hi ${firstName},

I wanted to share a quick view of how Constellation's AI sales assistant helps revenue teams create more relevant outreach without losing control of the message.

Administrators define the core guidance for the assistant, including approved positioning, tone, products, and compliance boundaries. When a rep generates an email, the assistant combines that guidance with the account record, contact role, opportunity context, recent activity, and any selected product focus so the draft is grounded in what is actually happening with ${accountName}.

The system also learns from the field. Reps can rate each response and leave feedback on what worked, what missed the mark, or what should be handled differently next time. Those signals feed a weekly refinement cycle that sharpens each user's prompt guidance while keeping the broader admin standards intact.

The result is a sales agent that produces faster, more consistent first drafts today and becomes more accurate for each seller over time.

Worth a brief walkthrough of how this could support your account planning and outbound motion?`
    };
  }

  const responses = {
    'get-daily-briefing': {
      priorities: [
        {
          title: 'Close Stark Logistics SD-WAN proposal with new leadership alignment',
          reason: 'The expansion team is reviewing the SD-WAN business case. Lead with predictable rollout timing, cold-chain uptime, and fewer vendor escalations.'
        },
        {
          title: 'Escalate Caesars pilot success metrics',
          reason: 'Caesars is prioritizing guest-experience technology. Use the pilot scorecard to move from property-level proof to enterprise rollout.'
        }
      ]
    },
    'generate-social-post': {
      suggestion: 'Enterprise networks are no longer back-office plumbing. For logistics and hospitality teams, resilient connectivity is now customer experience infrastructure.'
    },
    'refine-social-post': {
      suggestion: 'Resilient edge connectivity has become a boardroom issue. The teams that modernize now will move faster, recover faster, and serve customers better.'
    },
    'generate-sequence-steps': {
      steps: [
        { type: 'Email', subject: 'Operational resilience benchmark', message: 'Share a concise benchmark and ask for a 15-minute review.', content: 'Share a concise benchmark and ask for a 15-minute review.', delay_days: 0 },
        { type: 'LinkedIn', subject: 'Relevant industry proof point', message: 'Reference an expansion or reliability trigger.', content: 'Reference an expansion or reliability trigger.', delay_days: 2 },
        { type: 'Call', subject: 'Discovery follow-up', message: 'Ask about renewal timing, site count, and executive priorities.', content: 'Ask about renewal timing, site count, and executive priorities.', delay_days: 4 }
      ]
    },
    'generate-prospect-email': demoProspectEmail,
    'generate-custom-suggestion': {
      subject: 'Follow-up: network readiness and expansion timing',
      body: 'Hi Sarah, based on the expansion timing, it may be worth pressure-testing WAN resiliency before the new facilities come online. Constellation can help benchmark uptime, provider complexity, and phased deployment risk in one working session.'
    },
    'get-activity-insight': {
      insight: 'This account is showing expansion intent. Recommended next move: tie the technical conversation to executive risk and implementation timing.'
    },
    'get-gemini-suggestion': {
      subject: 'Expansion timing and network resilience',
      body: 'Hi Sarah, I saw Stark is expanding cold-chain capacity. Teams usually revisit WAN resilience when new facilities add operational risk. Worth comparing notes on how you are thinking about uptime, rollout timing, and provider consolidation?'
    },
    'get-account-briefing': {
      summary: 'Caesars is an existing strategic account with an executive technology initiative tied to guest experience uptime.',
      key_players: '**Dr. Elena Rostov** is the executive sponsor. **Marcus Wright** is the operational champion for the pilot.',
      pipeline: 'Open pipeline includes a multi-property fiber and managed network expansion with a $42.8K MRC opportunity.',
      activity_highlights: '- Pilot scoping call completed.\n- Success criteria review is the next best step.\n- Business case should connect guest operations to property uptime.',
      news: 'Hospitality operators are increasing investment in digital guest operations, creating a strong wedge for network modernization.',
      new_contacts: 'Target property operations and digital guest experience leaders once the pilot scorecard is approved.',
      icebreakers: '- Mention the guest-experience technology initiative.\n- Ask how they define uptime success by property.\n- Reference the opportunity to reduce vendor sprawl.',
      recommendation: 'Use the Las Vegas pilot to secure executive alignment, then position a phased regional rollout.'
    },
    'generate-agenda': {
      agenda: 'Subject: Caesars pilot success metrics review\n\n1. Confirm pilot-property operating goals\n2. Review current vendor and outage pain points\n3. Align on guest-experience uptime metrics\n4. Discuss proposed Constellation architecture\n5. Confirm next steps for regional rollout business case',
      personal_context_id: null
    },
    'generate-presentation-highlight': {
      highlight: {
        slides: [
          { title: 'Strategic Thesis', bullets: ['Pilot-first path to enterprise rollout', 'Guest-experience uptime as the executive metric'] },
          { title: 'Next 90 Days', bullets: ['Validate pilot criteria', 'Build business case', 'Finalize phased expansion plan'] }
        ]
      }
    },
    'extract-contact-info': {
      first_name: 'Jordan',
      last_name: 'Taylor',
      email: 'jordan.taylor@caesars.example.com',
      title: 'Director of Property Technology',
      company: 'Caesars Entertainment'
    }
  };

  window.__constellationDemoApiResponse = (name, body = {}) => {
    if (typeof responses[name] === 'function') return responses[name](body);
    if (responses[name]) return responses[name];
    return {
      suggestion: 'Demo AI response generated from canned local data.',
      body
    };
  };

  function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function demoUserId() {
    return window.CONSTELLATION_DEMO_STATE?.user?.id || 'demo-user';
  }

  function ensureDemoTables() {
    const state = window.CONSTELLATION_DEMO_STATE;
    if (!state) return null;
    state.tables = state.tables || {};
    if (!state.tables.org_settings) {
      state.tables.org_settings = [{ id: 1, email_calendar_enabled: true }];
    }
    if (!state.tables.user_integrations) state.tables.user_integrations = [];
    if (!state.tables.user_settings) state.tables.user_settings = [];
    if (!state.tables.calendar_events) state.tables.calendar_events = [];
    return state;
  }

  function parseUrl(url) {
    try {
      return new URL(url, window.location.origin);
    } catch {
      return null;
    }
  }

  function connectedIntegration(state) {
    const settings = state.tables.org_settings?.[0] || { email_calendar_enabled: false };
    const integration = (state.tables.user_integrations || []).find((row) => row.user_id === demoUserId());
    const connected = Boolean(settings.email_calendar_enabled && integration?.status === 'connected' && integration?.nylas_grant_id);
    return { settings, integration, connected };
  }

  async function handleIntegrationsApi(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};
    const state = ensureDemoTables();
    if (!state) return jsonResponse({ error: 'Demo state unavailable' }, 500);
    const parsed = parseUrl(url);

    if (url.includes('/api/integrations/nylas/auth-url') && method === 'POST') {
      const provider = body.provider === 'microsoft' ? 'microsoft' : 'google';
      const email = provider === 'microsoft' ? 'demo@outlook.com' : 'demo@gmail.com';
      state.tables.user_integrations = [{
        id: 'demo-integration-1',
        user_id: demoUserId(),
        provider,
        nylas_grant_id: `demo-grant-${provider}`,
        email,
        status: 'connected'
      }];
      const returnTo = typeof body.returnTo === 'string' ? body.returnTo : 'ai-admin.html?tab=integrations';
      const sep = returnTo.includes('?') ? '&' : '?';
      return jsonResponse({ authUrl: `${returnTo}${sep}integrations=connected`, provider });
    }

    if (url.includes('/api/integrations/nylas/disconnect') && method === 'POST') {
      state.tables.user_integrations = [];
      return jsonResponse({ ok: true });
    }

    if (url.includes('/api/integrations/email/send') && method === 'POST') {
      const { settings, integration, connected } = connectedIntegration(state);
      if (!settings.email_calendar_enabled) {
        return jsonResponse({ error: 'Email & calendar integrations are disabled for this organization.' }, 403);
      }
      if (!connected) {
        return jsonResponse({ error: 'Connect Google or Outlook in User Settings to send email in-app.', code: 'not_connected' }, 409);
      }
      return jsonResponse({ ok: true, provider: integration.provider, from: integration.email, result: { id: 'demo-message-1' } });
    }

    if (url.includes('/api/integrations/calendar/events') && method === 'GET') {
      const { settings, integration, connected } = connectedIntegration(state);
      if (!settings.email_calendar_enabled) {
        return jsonResponse({ error: 'Email & calendar integrations are disabled for this organization.' }, 403);
      }
      if (!connected) {
        return jsonResponse({ error: 'Connect Google or Outlook in User Settings to use calendar.', code: 'not_connected' }, 409);
      }
      const start = Number(parsed?.searchParams.get('start'));
      const end = Number(parsed?.searchParams.get('end'));
      const limit = Number(parsed?.searchParams.get('limit')) || 50;
      let events = [...(state.tables.calendar_events || [])];
      if (Number.isFinite(start)) events = events.filter((ev) => Number(ev.startTime) >= start);
      if (Number.isFinite(end)) events = events.filter((ev) => Number(ev.startTime) <= end);
      events.sort((a, b) => Number(a.startTime) - Number(b.startTime));
      events = events.slice(0, Math.max(1, Math.min(limit, 100)));
      return jsonResponse({
        ok: true,
        provider: integration.provider,
        calendarColor: '#4285F4',
        events
      });
    }

    if (url.includes('/api/integrations/calendar/events') && method === 'POST') {
      const { integration, connected } = connectedIntegration(state);
      if (!connected) {
        return jsonResponse({ error: 'Connect Google or Outlook in User Settings to use calendar.', code: 'not_connected' }, 409);
      }
      const startTime = Number(body.startTime);
      const endTime = Number(body.endTime) || startTime + 3600;
      const created = {
        id: `demo-evt-${Date.now()}`,
        title: String(body.title || 'Untitled event').trim() || 'Untitled event',
        description: body.description ? String(body.description).slice(0, 160) : null,
        startTime,
        endTime,
        allDay: Boolean(body.allDay),
        location: body.location || null,
        calendarId: body.calendarId || 'primary',
        color: body.color || (integration.provider === 'microsoft' ? '#0078D4' : '#4285F4')
      };
      state.tables.calendar_events = state.tables.calendar_events || [];
      state.tables.calendar_events.push(created);
      return jsonResponse({ ok: true, provider: integration.provider, from: integration.email, result: created, events: [created] });
    }

    if (url.includes('/api/integrations/status') && method === 'GET') {
      const { settings, integration, connected } = connectedIntegration(state);
      return jsonResponse({
        orgEnabled: Boolean(settings.email_calendar_enabled),
        connected,
        provider: connected ? integration.provider : null,
        email: connected ? integration.email : null,
        status: integration?.status || null
      });
    }

    return null;
  }

  window.fetch = async (resource, options = {}) => {
    const url = typeof resource === 'string' ? resource : resource?.url || '';
    if (url.includes('/api/integrations/')) {
      const handled = await handleIntegrationsApi(url, options);
      if (handled) return handled;
    }
    const match = url.match(/\/api\/ai\/([^/?#]+)/);
    if (match) {
      const data = window.__constellationDemoApiResponse(match[1], options.body ? JSON.parse(options.body) : {});
      return jsonResponse(data);
    }
    return originalFetch(resource, options);
  };
})();

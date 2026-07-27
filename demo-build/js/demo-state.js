(() => {
  const userId = 'demo-user-001';
  const now = '2026-07-27T12:00:00.000Z';

  const accounts = [
    {
      id: 1001,
      user_id: userId,
      name: 'Caesars Entertainment',
      website: 'https://www.caesars.com',
      industry: 'Gaming & Hospitality',
      phone: '702-555-1200',
      address: 'One Caesars Palace Drive, Las Vegas, NV',
      city: 'Las Vegas',
      state: 'NV',
      tier: 'Tier 1',
      notes: 'Enterprise gaming account with multi-property expansion potential.',
      is_customer: true,
      quantity_of_sites: 58,
      employee_count: 49000,
      sf_account_locator: 'SF-CAE-001',
      starred: true
    },
    {
      id: 1002,
      user_id: userId,
      name: 'Stark Logistics',
      website: 'https://starklogistics.example.com',
      industry: 'Transportation & Logistics',
      phone: '312-555-8800',
      address: '2100 W Fulton Market, Chicago, IL',
      city: 'Chicago',
      state: 'IL',
      tier: 'Tier 1',
      notes: 'Multi-site SD-WAN and DIA refresh opportunity.',
      is_customer: false,
      quantity_of_sites: 12,
      employee_count: 1800,
      sf_account_locator: 'SF-STARK-012',
      starred: true
    },
    {
      id: 1003,
      user_id: userId,
      name: 'Nexus Health Systems',
      website: 'https://nexushealth.example.com',
      industry: 'Healthcare',
      phone: '404-555-0140',
      address: '88 Peachtree Center Ave, Atlanta, GA',
      city: 'Atlanta',
      state: 'GA',
      tier: 'Tier 2',
      notes: 'Regional healthcare system evaluating resilient network design.',
      is_customer: true,
      quantity_of_sites: 14,
      employee_count: 8200,
      sf_account_locator: 'SF-NEX-014',
      starred: false
    }
  ];

  const contacts = [
    { id: 2001, user_id: userId, account_id: 1001, first_name: 'Elena', last_name: 'Rostov', name: 'Dr. Elena Rostov', title: 'Chief Medical Information Officer', email: 'elena.rostov@caesars.example.com', phone: '702-555-1211', reports_to: null, notes: 'Executive sponsor for guest experience technology.' },
    { id: 2002, user_id: userId, account_id: 1001, first_name: 'Marcus', last_name: 'Wright', name: 'Marcus Wright', title: 'VP Network Operations', email: 'marcus.wright@caesars.example.com', phone: '702-555-1288', reports_to: 2001, notes: 'Operational champion for the Las Vegas pilot.' },
    { id: 2003, user_id: userId, account_id: 1002, first_name: 'Sarah', last_name: 'Chen', name: 'Sarah Chen', title: 'Director of Infrastructure', email: 'sarah.chen@starklogistics.example.com', phone: '312-555-8830', reports_to: null, notes: 'Owns WAN refresh technical requirements.' },
    { id: 2004, user_id: userId, account_id: 1002, first_name: 'James', last_name: 'Holden', name: 'James Holden', title: 'Procurement Lead', email: 'james.holden@starklogistics.example.com', phone: '312-555-8835', reports_to: 2003, notes: 'Controls commercial review and redlines.' },
    { id: 2005, user_id: userId, account_id: 1003, first_name: 'Mina', last_name: 'Patel', name: 'Mina Patel', title: 'CIO', email: 'mina.patel@nexushealth.example.com', phone: '404-555-0177', reports_to: null, notes: 'Focused on outage risk and patient-care resiliency.' }
  ];

  const dealStages = [
    { id: 1, stage_name: 'Discovery', sort_order: 1 },
    { id: 2, stage_name: 'Qualification', sort_order: 2 },
    { id: 3, stage_name: 'Proposal', sort_order: 3 },
    { id: 4, stage_name: 'Negotiation', sort_order: 4 },
    { id: 5, stage_name: 'Closed Won', sort_order: 5 },
    { id: 6, stage_name: 'Closed Lost', sort_order: 6 }
  ];

  const deals = [
    { id: 3001, user_id: userId, account_id: 1001, name: 'Caesars Multi-Property Fiber Expansion', stage: 'Proposal', term: 60, mrc: 42800, close_month: '2026-09', products: 'DIA, Managed SD-WAN, Cloud Connect', notes: 'Executive business case pending finance review.', is_committed: true, notes_last_updated: now },
    { id: 3002, user_id: userId, account_id: 1002, name: 'Stark Logistics SD-WAN Refresh', stage: 'Negotiation', term: 60, mrc: 34400, close_month: '2026-07', products: 'DIA, SD-WAN, Managed Router', notes: 'Waiting on redline feedback from procurement.', is_committed: true, notes_last_updated: now },
    { id: 3003, user_id: userId, account_id: 1003, name: 'Nexus Regional Resiliency Upgrade', stage: 'Discovery', term: 48, mrc: 18600, close_month: '2026-10', products: 'DIA, Ethernet, Voice', notes: 'Technical discovery scheduled.', is_committed: false, notes_last_updated: now }
  ];

  const tasks = [
    { id: 4001, user_id: userId, account_id: 1002, contact_id: 2003, description: 'Send preliminary SD-WAN pricing deck', due_date: '2026-07-29', status: 'Pending', priority: 'High' },
    { id: 4002, user_id: userId, account_id: 1001, contact_id: 2002, description: 'Confirm Caesars pilot-property success criteria', due_date: '2026-07-30', status: 'Pending', priority: 'High' },
    { id: 4003, user_id: userId, account_id: 1003, contact_id: 2005, description: 'Prepare healthcare resiliency case study', due_date: '2026-08-01', status: 'Pending', priority: 'Medium' }
  ];

  const activities = [
    { id: 5001, user_id: userId, account_id: 1002, contact_id: 2003, type: 'Email', description: 'Sent SD-WAN pricing matrix and implementation assumptions.', date: '2026-07-24', logged_to_sf: false },
    { id: 5002, user_id: userId, account_id: 1001, contact_id: 2002, type: 'Call', description: 'Discussed Caesars Las Vegas pilot scope and operational pain.', date: '2026-07-23', logged_to_sf: true },
    { id: 5003, user_id: userId, account_id: 1003, contact_id: 2005, type: 'Meeting', description: 'Discovery session on outage risk and network redundancy.', date: '2026-07-22', logged_to_sf: false }
  ];

  const sequences = [
    { id: 6001, user_id: userId, name: 'Architectural Partnership', description: 'High-value enterprise prospecting sequence', source: 'Personal' },
    { id: 6002, user_id: userId, name: 'Cloud Connectivity Follow-up', description: 'Post-discovery technical follow-up', source: 'AI' }
  ];

  const sequence_steps = [
    { id: 6101, sequence_id: 6001, user_id: userId, step_number: 1, type: 'Email', assigned_to: 'Sales', subject: 'Connection Request', message: 'Short value-oriented outreach around network modernization.', content: 'Short value-oriented outreach around network modernization.', delay_days: 0 },
    { id: 6102, sequence_id: 6001, user_id: userId, step_number: 2, type: 'LinkedIn', assigned_to: 'Sales', subject: 'Capability Statement', message: 'Share Constellation network transformation proof points.', content: 'Share Constellation network transformation proof points.', delay_days: 2 },
    { id: 6103, sequence_id: 6001, user_id: userId, step_number: 3, type: 'Call', assigned_to: 'Sales', subject: 'Discovery Call', message: 'Ask about site count, redundancy, and renewal timing.', content: 'Ask about site count, redundancy, and renewal timing.', delay_days: 5 }
  ];

  const contact_sequences = [
    { id: 6201, user_id: userId, contact_id: 2003, sequence_id: 6001, current_step_number: 2, status: 'Active', next_step_due_date: '2026-07-28' },
    { id: 6202, user_id: userId, contact_id: 2005, sequence_id: 6002, current_step_number: 1, status: 'Active', next_step_due_date: '2026-07-29' }
  ];

  const contact_sequence_steps = [
    { id: 6301, contact_sequence_id: 6201, sequence_step_id: 6101, status: 'completed', completed_at: '2026-07-24T12:00:00.000Z' },
    { id: 6302, contact_sequence_id: 6201, sequence_step_id: 6102, status: 'pending', completed_at: null },
    { id: 6303, contact_sequence_id: 6202, sequence_step_id: 6101, status: 'pending', completed_at: null }
  ];

  const campaigns = [
    { id: 9001, user_id: userId, name: 'Stark Cold-Chain Call Blitz', type: 'Call', filter_criteria: { selection_mode: 'abm_cart', contact_ids: [2003, 2004] }, email_subject: null, email_body: null, created_at: '2026-07-20T12:00:00.000Z', completed_at: null },
    { id: 9002, user_id: userId, name: 'Caesars Guided Email Pilot', type: 'Guided Email', filter_criteria: { selection_mode: 'abm_cart', contact_ids: [2002] }, email_subject: 'Guest experience uptime at {AccountName}', email_body: 'Hi {FirstName}, I saw Caesars is investing in digital guest operations. Worth comparing notes on how network uptime and provider consolidation support that rollout?', created_at: '2026-07-15T12:00:00.000Z', completed_at: null }
  ];

  const campaign_members = [
    { id: 9101, campaign_id: 9001, contact_id: 2003, user_id: userId, status: 'Pending', completed_at: null },
    { id: 9102, campaign_id: 9001, contact_id: 2004, user_id: userId, status: 'Pending', completed_at: null },
    { id: 9103, campaign_id: 9002, contact_id: 2002, user_id: userId, status: 'Pending', completed_at: null }
  ];

  const marketing_sequences = [
    { id: 70001, user_id: userId, name: 'Enterprise WAN Nurture', description: 'Marketing-owned sequence for network modernization triggers.', source: 'Marketing' }
  ];

  const marketing_sequence_steps = [
    { id: 70011, marketing_sequence_id: 70001, step_number: 1, type: 'Email', subject: 'Industry benchmark', message: 'Share a benchmark and ask for a 15-minute network readiness conversation.', delay_days: 0 },
    { id: 70012, marketing_sequence_id: 70001, step_number: 2, type: 'Call', subject: 'Follow-up call', message: 'Ask about site expansion, resiliency gaps, and renewal timing.', delay_days: 3 }
  ];

  const cognito_alerts = [
    { id: 7001, user_id: userId, account_id: 1002, headline: 'Stark Logistics announces cold-chain expansion', trigger_type: 'Expansion', summary: 'New facilities increase need for resilient WAN and real-time monitoring.', source_url: 'https://example.com/stark-expansion', source_name: 'Logistics Business Journal', relevance_score: 5, status: 'New', created_at: now },
    { id: 7002, user_id: userId, account_id: 1001, headline: 'Caesars investing in guest experience technology', trigger_type: 'Technology Partnership', summary: 'Digital guest operations initiative creates a network modernization wedge.', source_url: 'https://example.com/caesars-guest-tech', source_name: 'Hospitality Tech Review', relevance_score: 4, status: 'New', created_at: now }
  ];

  const social_hub_posts = [
    { id: 8001, type: 'ai_article', title: 'Why resilient edge networks matter for logistics', link: 'https://example.com/logistics-edge', source_name: 'Industry Signals', summary: 'A concise thought leadership article for transportation prospects.', created_at: now },
    { id: 8002, type: 'ai_article', title: 'Hospitality networks are now guest experience infrastructure', link: 'https://example.com/hospitality-networks', source_name: 'Hospitality Tech Review', summary: 'A shareable POV for casino and resort operators.', created_at: now },
    { id: 8003, type: 'marketing_post', title: 'Constellation Strategic Account OS', link: 'https://www.constellation-crm.com', source_name: 'Constellation Marketing', approved_copy: 'Strategic account teams need more than CRM fields. Constellation turns pursuit strategy, relationship maps, expansion plans, and next moves into one operating system.', created_at: now }
  ];

  const account_plans = [
    {
      id: 'plan-1001',
      account_id: 1001,
      created_by: userId,
      updated_at: now,
      plan: {
        schema_version: 2,
        current_draft: {
          updated_at: now,
          sections: {
            account_snapshot: { tier: 'Tier 1', relationship_status: 'Existing customer', pursuit_priority: 'High', expansion_potential: 'Multi-property managed network expansion' },
            pursuit_thesis: { thesis: 'Use a Las Vegas pilot to prove guest-experience uptime and expand across regional properties.', action_forcing_event: 'Digital guest operations investment window', operational_pain_selected: ['Vendor sprawl', 'Outage risk'] },
            influence_mapping: { executive: [{ id: '2001', influence_level: 'High', role: 'Economic buyer' }], mid_level: [{ id: '2002', influence_level: 'High', is_champion: '1', role: 'Operational champion' }], technical: [], access_path: { current: 'Marcus Wright', desired: 'Elena Rostov', strategy: 'Pilot success metrics review' } },
            white_space: { initial_entry: 'Las Vegas pilot', expansion_path: 'Regional casino network modernization', rows: [{ name: 'Managed SD-WAN', area: 'Network', opportunity: 'Replace fragmented providers', confidence: 'High' }] },
            competitive_landscape: { incumbents: 'National carrier incumbent', narrative: 'Incumbent is stable but slow across property-specific needs.' },
            entry_points: [{ contact_id: '2002', contact_name: 'Marcus Wright', why_they_matter: 'Owns network operations', operational_pain: 'Multiple property vendors', next_move: 'Review pilot scope' }],
            strategic_tensions: ['Guest experience uptime is now an executive metric.', 'Property-level network decisions slow enterprise standardization.'],
            critical_unknowns: ['Final decision committee for regional rollout', 'Incumbent carrier termination windows'],
            psychology: { account_energy: 'Positive but evidence-driven', seller_posture: 'Lead with operational proof, not product breadth' },
            plan_30_60_90: { days_30: 'Validate pilot property and metrics', days_60: 'Deliver business case and design', days_90: 'Finalize phased rollout' },
            interaction_log: [{ date: '2026-07-23', text: 'Pilot scoping call completed.', source: 'activity' }]
          }
        },
        history: []
      }
    }
  ];

  const proposal_specs = [
    {
      id: 'proposal-1002',
      account_id: 1002,
      name: 'Stark Logistics SD-WAN Refresh Proposal',
      updated_at: now,
      spec: {
        globalRfp: 'STARK-WAN-2026',
        globalBiz: 'Stark Logistics',
        globalRep: 'Alex Rivera',
        globalDate: '2026-07-27',
        coverText: 'Thank you for the opportunity to support Stark Logistics with a resilient, scalable SD-WAN refresh.',
        customPages: {
          '0': {
            title: 'Network Modernization Thesis',
            body: 'Stark Logistics is expanding operational capacity while increasing dependency on real-time network performance. The proposed Constellation design reduces provider complexity, improves resiliency across distribution sites, and gives leadership a phased path from today’s WAN environment to a more predictable operating model.'
          }
        },
        impactCurrentState: 'Fragmented WAN providers, inconsistent site resiliency, and limited visibility across new cold-chain facilities.',
        impactProposedState: 'A standardized managed network architecture with SD-WAN, dedicated internet access, and phased site deployment governance.',
        impactCurrentCost: '42000',
        impactProposedCost: '34400',
        enableLocationSubtotals: true,
        enableQuoteExpiration: true,
        quoteExpirationDays: '30',
        enableTaxesFeesExclusion: true,
        pricingOptions: [{
          term: '60',
          solutionId: 'DEMO-SQ-001',
          locations: [{
            name: 'Chicago Distribution HQ',
            promotions: [{ description: 'First month service credit', amount: '-11250' }],
            items: [
              { prod: 'Dedicated Internet Access 1Gbps', price: '11250', qty: '1', nrcEnabled: true, nrcDescription: 'Installation', nrcAmount: '78000' },
              { prod: 'Managed SD-WAN Edge', price: '1850', qty: '1', nrcEnabled: false, nrcDescription: '', nrcAmount: '' }
            ]
          }]
        }],
        readiness: { rfpBiz: true, cover: true, pricing: true, ready: true },
        modules: [
          { filename: '01_Title_Page.pdf', checked: true },
          { filename: 'COVER_LETTER', checked: true },
          { filename: 'TOC', checked: true },
          { filename: '02_Why_GPC.pdf', checked: false },
          { filename: 'DIA.pdf', checked: true },
          { filename: '24_Hour_NOC.pdf', checked: true },
          { filename: 'CUSTOM_PDF', checked: false },
          { filename: 'PRICING', checked: true },
          { filename: '03_About_GPC.pdf', checked: false },
          { filename: 'CUSTOM_TEXT', checked: true, customIndex: '0' },
          { filename: 'REFERENCES', checked: false },
          { filename: 'IMPACT_ROI', checked: true },
          { filename: '04_Escalation.pdf', checked: false },
          { filename: '05_Implementation.pdf', checked: true },
          { filename: '08_SPIN.pdf', checked: false },
          { filename: '07_SeniorLeadership.pdf', checked: false },
          { filename: 'SIA.pdf', checked: false },
          { filename: 'USAC_RFP', checked: false }
        ],
        references: []
      }
    }
  ];

  const irr_projects = [
    {
      id: 'irr-stark-demo',
      project_name: 'Stark Logistics SD-WAN Refresh',
      global_discount_rate: 15,
      business_case_start: '2026-07',
      user_id: userId,
      last_saved: now,
      sites: [
        { id: 1, name: 'Chicago Distribution HQ', inputs: { constructionCost: 48500, engineeringCost: 12500, productCost: 32000, monthlyCost: 1850, nrr: 78000, mrr: 11250, term: 60, freeMonths: 1 }, timeline: { constructionStartMonth: 0, billingStartMonth: 2, constructionDurationMonths: 2, constructionStartMonthISO: '2026-07', billingStartMonthISO: '2026-09' }, result: {} },
        { id: 2, name: 'Dallas Regional Warehouse', inputs: { constructionCost: 72000, engineeringCost: 18000, productCost: 41500, monthlyCost: 2400, nrr: 96000, mrr: 14800, term: 60, freeMonths: 2 }, timeline: { constructionStartMonth: 1, billingStartMonth: 4, constructionDurationMonths: 3, constructionStartMonthISO: '2026-08', billingStartMonthISO: '2026-11' }, result: {} },
        { id: 3, name: 'Phoenix Cold Chain Site', inputs: { constructionCost: 36500, engineeringCost: 9500, productCost: 22500, monthlyCost: 1225, nrr: 54000, mrr: 8350, term: 48, freeMonths: 3 }, timeline: { constructionStartMonth: 2, billingStartMonth: 5, constructionDurationMonths: 3, constructionStartMonthISO: '2026-09', billingStartMonthISO: '2026-12' }, result: {} }
      ]
    }
  ];

  window.CONSTELLATION_DEMO_STATE = {
    user: { id: userId, email: 'demo@constellation-crm.com', user_metadata: { full_name: 'Demo User' } },
    tables: {
      user_quotas: [{ user_id: userId, full_name: 'Demo User', monthly_quota: 50000, is_manager: true, show_in_pipeline: true }],
      user_preferences: [],
      accounts,
      contacts,
      deals,
      deal_stages: dealStages,
      campaigns,
      campaign_members,
      tasks,
      activities,
      sequences,
      sequence_steps,
      contact_sequences,
      contact_sequence_steps,
      cognito_alerts,
      social_hub_posts,
      user_post_interactions: [],
      account_plans,
      proposal_specs,
      irr_projects,
      activity_types: [{ id: 1, type_name: 'Call' }, { id: 2, type_name: 'Email' }, { id: 3, type_name: 'Meeting' }],
      email_log: [],
      personal_context: [],
      product_knowledge: [{ product_name: 'Dedicated Internet Access' }, { product_name: 'Managed SD-WAN' }],
      marketing_sequences,
      marketing_sequence_steps
    }
  };
})();

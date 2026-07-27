(() => {
  const userId = 'demo-user-001';
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const now = today.toISOString();

  function dateFromToday(offsetDays) {
    const date = new Date(today);
    date.setDate(date.getDate() + offsetDays);
    return date;
  }

  function dateOnlyFromToday(offsetDays) {
    const date = dateFromToday(offsetDays);
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  function timestampFromToday(offsetDays) {
    return dateFromToday(offsetDays).toISOString();
  }

  function monthFromToday(offsetDays) {
    const date = dateFromToday(offsetDays);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

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
    { id: 3001, user_id: userId, account_id: 1001, name: 'Caesars Multi-Property Fiber Expansion', stage: 'Proposal', term: 60, mrc: 42800, close_month: monthFromToday(60), products: 'DIA, Managed SD-WAN, Cloud Connect', notes: 'Executive business case pending finance review.', is_committed: true, notes_last_updated: now },
    { id: 3002, user_id: userId, account_id: 1002, name: 'Stark Logistics SD-WAN Refresh', stage: 'Negotiation', term: 60, mrc: 34400, close_month: monthFromToday(15), products: 'DIA, SD-WAN, Managed Router', notes: 'Waiting on redline feedback from procurement.', is_committed: true, notes_last_updated: now },
    { id: 3003, user_id: userId, account_id: 1001, name: 'Caesars Regional Resiliency Upgrade', stage: 'Discovery', term: 48, mrc: 18600, close_month: monthFromToday(90), products: 'DIA, Ethernet, Voice', notes: 'Technical discovery scheduled.', is_committed: false, notes_last_updated: now }
  ];

  const tasks = [
    { id: 4001, user_id: userId, account_id: 1002, contact_id: 2003, description: 'Send preliminary SD-WAN pricing deck', due_date: dateOnlyFromToday(2), status: 'Pending', priority: 'High' },
    { id: 4002, user_id: userId, account_id: 1001, contact_id: 2002, description: 'Confirm Caesars pilot-property success criteria', due_date: dateOnlyFromToday(3), status: 'Pending', priority: 'High' },
    { id: 4003, user_id: userId, account_id: 1003, contact_id: 2005, description: 'Prepare healthcare resiliency case study', due_date: dateOnlyFromToday(5), status: 'Pending', priority: 'Medium' }
  ];

  const activities = [
    { id: 5001, user_id: userId, account_id: 1002, contact_id: 2003, type: 'Email', description: 'Sent SD-WAN pricing matrix and implementation assumptions.', date: dateOnlyFromToday(-3), logged_to_sf: false },
    { id: 5002, user_id: userId, account_id: 1001, contact_id: 2002, type: 'Call', description: 'Discussed Caesars Las Vegas pilot scope and operational pain.', date: dateOnlyFromToday(-4), logged_to_sf: true },
    { id: 5003, user_id: userId, account_id: 1001, contact_id: 2001, type: 'Meeting', description: 'Discovery session on outage risk and network redundancy.', date: dateOnlyFromToday(-7), logged_to_sf: false }
  ];

  const sequences = [
    { id: 6001, user_id: userId, name: 'Architectural Partnership', description: 'High-value enterprise prospecting sequence', source: 'Personal' },
    { id: 6002, user_id: userId, name: 'Cloud Connectivity Follow-up', description: 'Post-discovery technical follow-up', source: 'AI' }
  ];

  const sequence_steps = [
    { id: 6101, sequence_id: 6001, user_id: userId, step_number: 1, type: 'Email', assigned_to: 'Sales', subject: 'Connection Request', message: 'Short value-oriented outreach around network modernization.', content: 'Short value-oriented outreach around network modernization.', delay_days: 0 },
    { id: 6102, sequence_id: 6001, user_id: userId, step_number: 2, type: 'LinkedIn', assigned_to: 'Sales', subject: 'Capability Statement', message: 'Share Constellation network transformation proof points.', content: 'Share Constellation network transformation proof points.', delay_days: 2 },
    { id: 6103, sequence_id: 6001, user_id: userId, step_number: 3, type: 'Call', assigned_to: 'Sales', subject: 'Discovery Call', message: 'Ask about site count, redundancy, and renewal timing.', content: 'Ask about site count, redundancy, and renewal timing.', delay_days: 5 },
    { id: 6104, sequence_id: 6002, user_id: userId, step_number: 1, type: 'Email', assigned_to: 'Sales', subject: 'Architecture recap', message: 'Send the cloud connectivity recap and confirm next design review.', content: 'Send the cloud connectivity recap and confirm next design review.', delay_days: 0 },
    { id: 6105, sequence_id: 6002, user_id: userId, step_number: 2, type: 'Call', assigned_to: 'Sales', subject: 'Technical validation', message: 'Confirm redundancy, cloud region, and migration timing requirements.', content: 'Confirm redundancy, cloud region, and migration timing requirements.', delay_days: 2 },
    { id: 6106, sequence_id: 6002, user_id: userId, step_number: 3, type: 'Email', assigned_to: 'Sales', subject: 'Business case follow-up', message: 'Share the business case summary and proposed next step.', content: 'Share the business case summary and proposed next step.', delay_days: 4 }
  ];

  const contact_sequences = [
    { id: 6201, user_id: userId, contact_id: 2003, sequence_id: 6001, current_step_number: 2, status: 'Active', next_step_due_date: dateOnlyFromToday(-2) },
    { id: 6202, user_id: userId, contact_id: 2001, sequence_id: 6002, current_step_number: 1, status: 'Active', next_step_due_date: dateOnlyFromToday(0) }
  ];

  const contact_sequence_steps = [
    { id: 6301, contact_sequence_id: 6201, sequence_step_id: 6101, status: 'completed', completed_at: timestampFromToday(-2) },
    { id: 6302, contact_sequence_id: 6201, sequence_step_id: 6102, status: 'pending', completed_at: null },
    { id: 6303, contact_sequence_id: 6202, sequence_step_id: 6104, status: 'pending', completed_at: null }
  ];

  const campaigns = [
    { id: 9001, user_id: userId, name: 'Stark Cold-Chain Call Blitz', type: 'Call', filter_criteria: { selection_mode: 'abm_cart', contact_ids: [2003, 2004] }, email_subject: null, email_body: null, created_at: timestampFromToday(-7), completed_at: null },
    { id: 9002, user_id: userId, name: 'Caesars Guided Email Pilot', type: 'Guided Email', filter_criteria: { selection_mode: 'abm_cart', contact_ids: [2002] }, email_subject: 'Guest experience uptime at {AccountName}', email_body: 'Hi {FirstName}, I saw Caesars is investing in digital guest operations. Worth comparing notes on how network uptime and provider consolidation support that rollout?', created_at: timestampFromToday(-12), completed_at: null }
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
            interaction_log: [{ date: dateOnlyFromToday(-4), text: 'Pilot scoping call completed.', source: 'activity' }]
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
        globalDate: dateOnlyFromToday(0),
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
      business_case_start: monthFromToday(0),
      user_id: userId,
      last_saved: now,
      sites: [
        { id: 1, name: 'Chicago Distribution HQ', inputs: { constructionCost: 48500, engineeringCost: 12500, productCost: 32000, monthlyCost: 1850, nrr: 78000, mrr: 11250, term: 60, freeMonths: 1 }, timeline: { constructionStartMonth: 0, billingStartMonth: 2, constructionDurationMonths: 2, constructionStartMonthISO: monthFromToday(0), billingStartMonthISO: monthFromToday(60) }, result: {} },
        { id: 2, name: 'Dallas Regional Warehouse', inputs: { constructionCost: 72000, engineeringCost: 18000, productCost: 41500, monthlyCost: 2400, nrr: 96000, mrr: 14800, term: 60, freeMonths: 2 }, timeline: { constructionStartMonth: 1, billingStartMonth: 4, constructionDurationMonths: 3, constructionStartMonthISO: monthFromToday(30), billingStartMonthISO: monthFromToday(120) }, result: {} },
        { id: 3, name: 'Phoenix Cold Chain Site', inputs: { constructionCost: 36500, engineeringCost: 9500, productCost: 22500, monthlyCost: 1225, nrr: 54000, mrr: 8350, term: 48, freeMonths: 3 }, timeline: { constructionStartMonth: 2, billingStartMonth: 5, constructionDurationMonths: 3, constructionStartMonthISO: monthFromToday(60), billingStartMonthISO: monthFromToday(150) }, result: {} }
      ]
    }
  ];

  const expansionAccounts = [
    ['Meridian Retail Group', 'Retail', 'Tier 1', 'Denver', 'CO', 42, 12600, true],
    ['Atlas Manufacturing', 'Manufacturing', 'Tier 1', 'Cleveland', 'OH', 18, 5400, false],
    ['Summit Financial Partners', 'Financial', 'Tier 1', 'Charlotte', 'NC', 24, 9200, true],
    ['BluePeak Energy', 'General', 'Tier 2', 'Houston', 'TX', 31, 6800, false],
    ['HarborPoint Hotels', 'Gaming & Hospitality', 'Tier 2', 'Miami', 'FL', 16, 4100, true],
    ['Apex Distribution', 'Transportation & Logistics', 'Tier 2', 'Columbus', 'OH', 22, 3200, false],
    ['Northstar University', 'K-12 Education', 'Tier 3', 'Madison', 'WI', 9, 2400, true],
    ['CivicWorks County', 'Government', 'Tier 2', 'Sacramento', 'CA', 11, 5100, false],
    ['Quantum Software', 'Technology', 'Tier 1', 'Austin', 'TX', 7, 1850, false],
    ['Evergreen Clinics', 'Healthcare', 'Tier 2', 'Portland', 'OR', 15, 3600, true],
    ['Prairie Foods', 'Manufacturing', 'Tier 3', 'Omaha', 'NE', 12, 2100, false],
    ['Metro Transit Authority', 'Government', 'Tier 1', 'Minneapolis', 'MN', 33, 11400, true],
    ['BrightPath Nonprofit', 'Nonprofit', 'Tier 3', 'Nashville', 'TN', 6, 750, false]
  ];

  const firstNames = ['Avery', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Jamie', 'Quinn', 'Rowan', 'Parker', 'Reese', 'Cameron', 'Drew'];
  const lastNames = ['Stone', 'Rivera', 'Bennett', 'Cole', 'Hayes', 'Brooks', 'Reed', 'Sullivan', 'Bishop', 'Lane', 'Porter', 'Ellis', 'Morris'];
  const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation'];
  const products = ['DIA, Managed SD-WAN', 'Ethernet, Cloud Connect', 'DIA, Voice', 'Managed Router, SD-WAN', 'Dark Fiber, Cloud Connect'];
  const expansionAccountNamesById = new Map(expansionAccounts.map(([name], index) => [1010 + index, name]));
  const baseAccountNamesById = new Map(accounts.map(account => [account.id, account.name]));
  const baseContactAccountIds = new Map(contacts.map(contact => [contact.id, contact.account_id]));
  const sequenceContactTargets = [2010, 2002, 2010, 2013, 2003, 2016, 2016, 2018, 2018, 2019, 2010, 2021, 2001];
  const sequenceDueOffsets = [-6, -5, -4, -3, -2, -1, 0, 0, 0, 1, 2, 4, 6];
  const activityContactTargets = [2010, 2002, 2012, 2010, 2014, 2014, 2016, 2018, 2018, 2019, 2003, 2021, 2001];
  const activityDateOffsets = [-2, -3, -4, -5, -6, -8, -10, -12, -13, -15, -18, -21, -25];
  const dealAccountTargets = [1010, 1001, 1012, 1013, 1002, 1010, 1016, 1018, 1018, 1019, 1001, 1021, 1012];

  function accountIdForContact(contactId) {
    if (baseContactAccountIds.has(contactId)) return baseContactAccountIds.get(contactId);
    if (contactId >= 2010 && contactId <= 2022) return 1010 + (contactId - 2010);
    return null;
  }

  function accountNameForId(accountId) {
    return baseAccountNamesById.get(accountId) || expansionAccountNamesById.get(accountId) || 'Demo Account';
  }

  expansionAccounts.forEach(([name, industry, tier, city, region, sites, employees, customer], index) => {
    const accountId = 1010 + index;
    const contactId = 2010 + index;
    const dealId = 3010 + index;
    const seqId = 6010 + index;
    const campaignId = 9010 + index;
    const safeDomain = name.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/^$/, 'demo');
    const contactName = `${firstNames[index]} ${lastNames[index]}`;
    const mrc = 8200 + (index * 2750);
    const stage = stages[index % stages.length];
    const closeMonth = monthFromToday(30 * ((index % 6) + 1));
    const dealAccountId = dealAccountTargets[index] || accountId;
    const dealAccountName = accountNameForId(dealAccountId);
    const activityContactId = activityContactTargets[index] || contactId;
    const activityAccountId = accountIdForContact(activityContactId) || accountId;
    const sequenceContactId = sequenceContactTargets[index] || contactId;

    accounts.push({
      id: accountId,
      user_id: userId,
      name,
      website: `https://${safeDomain}.example.com`,
      industry,
      phone: `555-${String(2400 + index).padStart(4, '0')}`,
      address: `${100 + index} Market Street, ${city}, ${region}`,
      city,
      state: region,
      tier,
      notes: `${industry} account with multi-location modernization potential.`,
      is_customer: customer,
      quantity_of_sites: sites,
      employee_count: employees,
      sf_account_locator: `SF-DEMO-${accountId}`,
      starred: index % 3 === 0
    });

    contacts.push({
      id: contactId,
      user_id: userId,
      account_id: accountId,
      first_name: firstNames[index],
      last_name: lastNames[index],
      name: contactName,
      title: index % 2 === 0 ? 'VP Infrastructure' : 'Director of IT Operations',
      email: `${firstNames[index].toLowerCase()}.${lastNames[index].toLowerCase()}@${safeDomain}.example.com`,
      phone: `555-${String(6400 + index).padStart(4, '0')}`,
      reports_to: null,
      notes: 'Primary stakeholder for connectivity, site readiness, and rollout planning.'
    });

    deals.push({
      id: dealId,
      user_id: userId,
      account_id: dealAccountId,
      name: `${dealAccountName} Network Modernization`,
      stage,
      term: index % 3 === 0 ? 36 : 60,
      mrc,
      close_month: closeMonth,
      products: products[index % products.length],
      notes: 'Demo opportunity seeded for pipeline depth and forecasting.',
      is_committed: index % 2 === 0,
      notes_last_updated: now
    });

    tasks.push({
      id: 4010 + index,
      user_id: userId,
      account_id: accountId,
      contact_id: contactId,
      description: `Follow up with ${contactName} on ${name} rollout priorities`,
      due_date: dateOnlyFromToday(2 + (index % 18)),
      status: 'Pending',
      priority: index % 2 === 0 ? 'High' : 'Medium'
    });

    activities.push({
      id: 5010 + index,
      user_id: userId,
      account_id: activityAccountId,
      contact_id: activityContactId,
      type: index % 2 === 0 ? 'Call' : 'Email',
      description: `Discussed ${industry.toLowerCase()} network priorities and next-step criteria.`,
      date: dateOnlyFromToday(activityDateOffsets[index]),
      logged_to_sf: index % 4 === 0
    });

    sequences.push({
      id: seqId,
      user_id: userId,
      name: `${industry} Modernization Sequence`,
      description: `Demo outreach sequence for ${industry.toLowerCase()} account triggers.`,
      source: index % 2 === 0 ? 'Personal' : 'AI'
    });

    [0, 1, 2].forEach((stepOffset) => {
      sequence_steps.push({
        id: 6110 + (index * 3) + stepOffset,
        sequence_id: seqId,
        user_id: userId,
        step_number: stepOffset + 1,
        type: ['Email', 'LinkedIn', 'Call'][stepOffset],
        assigned_to: 'Sales',
        subject: ['Business trigger', 'Relevant proof point', 'Discovery follow-up'][stepOffset],
        message: ['Reference the account trigger and ask for a short review.', 'Share a relevant operating insight.', 'Confirm timing, stakeholders, and success criteria.'][stepOffset],
        content: ['Reference the account trigger and ask for a short review.', 'Share a relevant operating insight.', 'Confirm timing, stakeholders, and success criteria.'][stepOffset],
        delay_days: stepOffset * 2
      });
    });

    contact_sequences.push({
      id: 6210 + index,
      user_id: userId,
      contact_id: sequenceContactId,
      sequence_id: seqId,
      current_step_number: (index % 3) + 1,
      status: 'Active',
      next_step_due_date: dateOnlyFromToday(sequenceDueOffsets[index])
    });

    campaigns.push({
      id: campaignId,
      user_id: userId,
      name: `${name} ${index % 2 === 0 ? 'Call Blitz' : 'Guided Email'}`,
      type: index % 2 === 0 ? 'Call' : 'Guided Email',
      filter_criteria: { selection_mode: 'abm_cart', contact_ids: [contactId], tier, industry },
      email_subject: `Network readiness at ${name}`,
      email_body: `Hi {FirstName}, I noticed ${name} is a strong fit for a network modernization review. Worth comparing notes on site readiness and resiliency priorities?`,
      created_at: timestampFromToday(-20 + index),
      completed_at: index > 9 ? timestampFromToday(-18 + index) : null
    });

    campaign_members.push({
      id: 9120 + index,
      campaign_id: campaignId,
      contact_id: contactId,
      user_id: userId,
      status: index > 9 ? 'Completed' : 'Pending',
      completed_at: index > 9 ? timestampFromToday(-18 + index) : null
    });

    cognito_alerts.push({
      id: 7010 + index,
      user_id: userId,
      account_id: accountId,
      headline: `${name} signals ${index % 2 === 0 ? 'expansion' : 'technology refresh'} opportunity`,
      trigger_type: index % 2 === 0 ? 'Expansion' : 'Technology Partnership',
      summary: `New ${industry.toLowerCase()} activity creates a timely opening for a Constellation conversation.`,
      source_url: `https://example.com/${safeDomain}-signal`,
      source_name: 'Demo Market Signals',
      relevance_score: (index % 2) + 4,
      status: 'New',
      created_at: now
    });

    proposal_specs.push({
      id: `proposal-${accountId}`,
      account_id: accountId,
      name: `${name} Connectivity Proposal`,
      updated_at: now,
      spec: {
        globalRfp: `${safeDomain.toUpperCase().slice(0, 8)}-2026`,
        globalBiz: name,
        globalRep: 'Alex Rivera',
        globalDate: dateOnlyFromToday(0),
        coverText: `Thank you for the opportunity to support ${name} with a more resilient network operating model.`,
        pricingOptions: [{ term: '60', solutionId: `DEMO-${accountId}`, locations: [{ name: `${city} Primary Site`, promotions: [], items: [{ prod: products[index % products.length], price: String(mrc), qty: '1', nrcEnabled: true, nrcDescription: 'Implementation', nrcAmount: String(24000 + index * 3000) }] }] }],
        readiness: { rfpBiz: true, cover: true, pricing: true, ready: true },
        references: []
      }
    });
  });

  for (let i = 0; i < 10; i += 1) {
    social_hub_posts.push({
      id: 8010 + i,
      type: i % 3 === 0 ? 'marketing_post' : 'ai_article',
      title: i % 3 === 0 ? `Constellation field insight ${i + 1}` : `Enterprise network signal ${i + 1}`,
      link: `https://example.com/social-demo-${i + 1}`,
      source_name: i % 3 === 0 ? 'Constellation Marketing' : 'Industry Signals',
      summary: `Demo social content item ${i + 1} for sharing timely market and account insights.`,
      approved_copy: `Enterprise account teams win when insight, timing, and execution live in one operating system. Constellation helps make that practical.`,
      created_at: now
    });
  }

  for (let i = 0; i < 9; i += 1) {
    irr_projects[0].sites.push({
      id: 10 + i,
      name: `Expansion Site ${i + 1}`,
      inputs: { constructionCost: 28000 + i * 6500, engineeringCost: 7000 + i * 1200, productCost: 16000 + i * 2800, monthlyCost: 950 + i * 210, nrr: 42000 + i * 6500, mrr: 6200 + i * 900, term: i % 2 === 0 ? 60 : 48, freeMonths: (i % 3) + 1 },
      timeline: { constructionStartMonth: i % 6, billingStartMonth: (i % 4) + 2, constructionDurationMonths: 2 + (i % 2), constructionStartMonthISO: monthFromToday(30 * (i % 6)), billingStartMonthISO: monthFromToday(30 * ((i % 4) + 2)) },
      result: {}
    });
  }

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

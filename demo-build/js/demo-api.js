(() => {
  const originalFetch = window.fetch.bind(window);

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
    'generate-prospect-email': {
      email: 'Hi Sarah, I saw Stark is expanding cold-chain capacity. Teams usually revisit WAN resilience when new facilities add operational risk. Worth comparing notes on how you are thinking about uptime and provider consolidation?'
    },
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
    if (responses[name]) return responses[name];
    return {
      suggestion: 'Demo AI response generated from canned local data.',
      body
    };
  };

  window.fetch = async (resource, options = {}) => {
    const url = typeof resource === 'string' ? resource : resource?.url || '';
    const match = url.match(/\/api\/ai\/([^/?#]+)/);
    if (match) {
      const data = window.__constellationDemoApiResponse(match[1], options.body ? JSON.parse(options.body) : {});
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return originalFetch(resource, options);
  };
})();

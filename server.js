// Load local .env variables (if present)
try { require('dotenv').config(); } catch (e) { /* dotenv not installed, continue */ }
const express = require("express");
const path = require("path");
const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname)));

// Manual CORS implementation to avoid external dependencies
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// API Endpoint: Style Analyzer
app.post("/api/analyze", (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text field is required." });
    }

    // Dynamic style analysis helper
    const textLength = text.length;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    let tone = "Professional";
    let vocabulary = "Standard";
    let writingStyle = "Conversational";
    
    // Some simple dynamic analysis
    if (text.includes("!") || text.toLowerCase().includes("omg") || text.toLowerCase().includes("super")) {
        tone = "Friendly & Enthusiastic";
        writingStyle = "Conversational";
    } else if (wordCount > 100) {
        tone = "Analytical";
        vocabulary = "Academic";
        writingStyle = "Technical";
    } else if (text.toLowerCase().includes("would like to") || text.toLowerCase().includes("kindly") || text.toLowerCase().includes("regards")) {
        tone = "Formal";
        vocabulary = "Professional";
        writingStyle = "Corporate";
    }

    // Generate a deterministic authenticity score between 85 and 98 based on word count
    const score = 85 + (wordCount % 14);

    res.json({
        tone,
        vocabulary,
        writingStyle,
        authenticityScore: `${score}%`
    });
});

// API Endpoint: Content Generator (template-only)
app.post("/api/generate", (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: "Topic is required." });
    }
    // Support optional 'length' param: 'short' | 'medium' | 'long'
    const length = (req.body.length || 'medium').toLowerCase();
    const style = (req.body.style || 'professional').toLowerCase();

    // small helper utilities
    const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // lightweight category detection from topic keywords
    const detectCategory = (t) => {
        const s = t.toLowerCase();
        if (/(email|onboard|signup|welcome)/.test(s)) return 'email_onboarding';
        if (/(health|healthcare|medical|patient)/.test(s)) return 'healthcare';
        if (/(churn|retention|cancel|unsubscribe)/.test(s)) return 'retention';
        if (/(marketing|ad campaign|social|seo|blog)/.test(s)) return 'marketing';
        return 'general';
    };
    const category = detectCategory(topic);

    const openings = [
        `In today's rapidly evolving landscape, "${topic}" is reshaping how organizations approach strategy and execution.`,
        `"${topic}" has quickly become a focal point for teams looking to drive measurable outcomes.`,
        `Across industries, interest in "${topic}" is accelerating as leaders search for dependable ways to scale impact.`,
        `When teams adopt "${topic}", they unlock new possibilities for efficiency, creativity, and growth.`
    ];

    const problemStatements = {
        general: [
            `Many teams struggle with inconsistent quality and slow turnaround when producing content about ${topic}.`,
            `Common pain points include lack of clarity, repetitive phrasing, and difficulty maintaining voice across channels.`
        ],
        email_onboarding: [
            `Welcome emails often miss the chance to set expectations, driving low activation and poor first impressions.`,
            `Onboarding sequences can overwhelm new users or fail to highlight key product value.`
        ],
        healthcare: [
            `Healthcare content must balance clinical accuracy with accessible language for patients and stakeholders.`,
            `Regulatory and privacy considerations (HIPAA, local laws) complicate messaging in healthcare contexts.`
        ],
        retention: [
            `Retaining customers requires targeted messaging that addresses root causes of churn and keeps value clear.`,
            `Generic outreach often fails because it doesn't reflect customer behavior or lifecycle stage.`
        ],
        marketing: [
            `Marketing teams need content that converts while staying consistent across channels and campaign goals.`,
            `SEO-friendly structure and clear CTAs are frequently missing from quick copy drafts.`
        ]
    };

    const benefits = {
        general: [
            `Accelerate production while preserving your unique voice.`,
            `Reduce revision cycles and free subject matter experts for higher-value work.`
        ],
        email_onboarding: [
            `Increase activation by delivering clear next steps within the first 24 hours.`,
            `Reduce time-to-first-success with short, focused guidance.`
        ],
        healthcare: [
            `Create patient-friendly summaries that retain clinical accuracy.`,
            `Improve trust through transparent, empathetic language.`
        ],
        retention: [
            `Targeted messaging helps re-engage at-risk users and highlight immediate value.`,
            `Personalized offers and clear next steps reduce churn triggers.`
        ],
        marketing: [
            `Improve conversion by creating clarity in headlines and CTAs.`,
            `Optimize for search while keeping messaging customer-focused.`
        ]
    };

    const pillars = {
        general: [
            `Strategic Alignment — tie ${topic} directly to user outcomes and business metrics.`,
            `Automated Workflows — use templates and AI assistants to scale content creation.`,
            `Quality Controls — apply review gates and quick feedback loops to maintain voice.`
        ],
        email_onboarding: [
            `Clear Subject Lines — set expectations from the inbox.`,
            `Progressive Onboarding — surface features as users reach milestones.`,
            `Actionable Steps — every message should include exactly one next step.`
        ],
        healthcare: [
            `Accuracy & Sources — cite clinical sources and use plain-language summaries.`,
            `Consent & Privacy — ensure no protected data is exposed in copy.`,
            `Empathy-first Tone — prioritize patient understanding and reassurance.`
        ],
        retention: [
            `Behavioral Segmentation — tailor messages to the customer's actions.`,
            `Value Reminders — show what the user gets if they stay.`,
            `Flexible Offers — use targeted incentives sparingly and strategically.`
        ],
        marketing: [
            `Compelling Headlines — grab attention and promise a clear benefit.`,
            `Structured Content — use headers and bullets for scannability.`,
            `Measurable CTAs — link copy to a single measurable action.`
        ]
    };

    const examples = {
        general: [
            `Draft a three-paragraph explainer that introduces the topic, outlines benefits, and ends with a clear CTA.`,
            `Create a short social post highlighting one metric or customer quote.`
        ],
        email_onboarding: [
            `Subject: Welcome — 3 steps to get started with ${topic}.\nBody: Quick greeting, one short action, link to next step.`,
            `Sequence idea: Day 1 — Welcome + 1 task, Day 3 — Feature highlight, Day 7 — Use-case success story.`
        ],
        healthcare: [
            `Patient summary: 2–3 sentences that explain the concept, followed by a next step (call, appointment, link).`,
            `Provider brief: bulleted benefits, evidence links, and practical considerations for clinical teams.`
        ],
        retention: [
            `Re-engagement email with a personalized stat and a single CTA to return.`,
            `In-app message reminding users of a feature they haven’t used in 14 days.`
        ],
        marketing: [
            `Ad copy: one headline + one short supporting line + a CTA.`,
            `Blog intro: hook, 3 supporting points, and a conclusion with resources.`
        ]
    };

    const closings = {
        professional: [
            `Adopting these approaches ensures teams can scale with confidence while staying true to their brand.`,
            `With the right processes, ${topic} becomes a reliable lever for growth and customer trust.`
        ],
        conversational: [
            `Give it a try — start with one small experiment and iterate quickly.`,
            `Start small, measure what matters, and watch how momentum builds.`
        ]
    };

    // Compose content based on category and requested length
    let parts = [];
    parts.push(`Generated content on: ${topic}\n`);
    parts.push(sample(openings));

    parts.push('\nWhy it matters:');
    parts.push(sample(problemStatements[category] || problemStatements.general));

    if (length === 'short') {
        parts.push('\nKey benefit:');
        parts.push(sample(benefits[category] || benefits.general));
        parts.push('\nQuick example:');
        parts.push(sample(examples[category] || examples.general));
        parts.push('\n' + sample(closings[style] || closings.professional));
    } else if (length === 'long') {
        parts.push('\nKey Pillars:');
        const pList = (pillars[category] || pillars.general).slice();
        pList.sort(() => 0.5 - Math.random());
        pList.slice(0, 3).forEach((p, i) => parts.push(`${i+1}. ${p}`));

        parts.push('\nPractical Examples:');
        (examples[category] || examples.general).forEach(e => parts.push(`- ${e}`));

        parts.push('\nRecommended approach:');
        parts.push(`Start with a single experiment focused on one user segment; measure engagement and iterate.`);
        parts.push('\n' + sample(closings[style] || closings.professional));
    } else {
        // medium
        parts.push('\nKey Pillars:');
        const chosen = (pillars[category] || pillars.general).slice().sort(() => 0.5 - Math.random()).slice(0,3);
        chosen.forEach((p, i) => parts.push(`${i+1}. ${p}`));

        parts.push('\nA quick example:');
        parts.push(sample(examples[category] || examples.general));

        parts.push('\n' + sample(closings[style] || closings.professional));
    }

    const generatedText = parts.join('\n\n');

    res.json({ topic, generatedText, length, style, category, source: 'template' });
});

app.listen(5001, () => {
    console.log("Server Running on http://localhost:5001");
});
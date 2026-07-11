import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — biolink",
  description: "Terms of Service for biolink",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <article className="prose-invert mx-auto max-w-2xl">
        <p className="font-mono text-xs text-neutral-600">{"// legal"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-neutral-300">
          <Section title="1. Acceptance of Terms">
            By creating an account or using biolink (&quot;the Service&quot;), you agree to be
            bound by these Terms of Service. If you do not agree, do not use the Service.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 13 years old to use this Service. By registering, you
            confirm that you meet this age requirement and have the legal capacity to enter
            into this agreement.
          </Section>

          <Section title="3. Your Account">
            You are responsible for maintaining the security of your account and password.
            You agree to provide accurate information during registration and to keep it
            updated. You are fully responsible for all activity that occurs under your
            account.
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree NOT to use the Service to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Share illegal, harmful, or copyrighted content without permission</li>
              <li>Impersonate another person or entity</li>
              <li>Distribute malware, phishing links, or malicious content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape, spam, or overload the Service&apos;s infrastructure</li>
              <li>Promote hate speech, violence, or discrimination</li>
              <li>Share sexual content involving minors</li>
            </ul>
            <p className="mt-3">
              Violations may result in immediate account suspension or permanent ban without
              notice.
            </p>
          </Section>

          <Section title="5. Content Ownership">
            You retain full ownership of all content you upload or create on your page.
            By using the Service, you grant biolink a limited license to display, host, and
            process your content solely for operating the Service.
          </Section>

          <Section title="6. Content Moderation">
            We reserve the right to review, remove, or disable access to any content that
            violates these Terms or is otherwise objectionable. We may suspend or terminate
            accounts that violate our policies.
          </Section>

          <Section title="7. Third-Party Services">
            The Service may integrate with or link to third-party platforms (Discord, Spotify,
            YouTube, etc.). We are not responsible for the practices or content of these
            external services. Their terms and privacy policies apply.
          </Section>

          <Section title="8. Disclaimer of Warranties">
            The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without
            warranties of any kind, whether express or implied. We do not guarantee that the
            Service will be uninterrupted, secure, or error-free.
          </Section>

          <Section title="9. Limitation of Liability">
            To the maximum extent permitted by law, biolink shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising from
            your use of the Service.
          </Section>

          <Section title="10. Account Termination">
            You may delete your account at any time. We reserve the right to suspend or
            terminate your account at our sole discretion, with or without cause or notice.
          </Section>

          <Section title="11. Changes to Terms">
            We may update these Terms at any time. Continued use of the Service after changes
            constitutes acceptance of the new Terms. Material changes will be communicated via
            the Service.
          </Section>

          <Section title="12. Governing Law">
            These Terms are governed by applicable local laws. Any disputes shall be resolved
            through binding arbitration or in the appropriate courts.
          </Section>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <div className="mt-2 text-neutral-400">{children}</div>
    </section>
  );
}

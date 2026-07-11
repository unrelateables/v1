import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — biolink",
  description: "Privacy Policy for biolink",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs text-neutral-600">{"// legal"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-xs text-neutral-600">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-neutral-400">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, including your email address,
              username, display name, bio, avatar, links, and any content you upload. We also
              automatically collect usage data such as page views, link clicks, IP addresses,
              and browser type for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. How We Use Information</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>To create and manage your account and profile page</li>
              <li>To display your content on your public bio page</li>
              <li>To provide analytics (view counts, click counts)</li>
              <li>To prevent abuse, spam, and fraudulent activity</li>
              <li>To communicate with you about your account or the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Cookies and Authentication</h2>
            <p>
              We use cookies and authentication tokens to keep you logged in and remember your
              preferences. We do not use third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Data Storage</h2>
            <p>
              Your data is stored securely using our database provider (Supabase) and file
              storage. Uploaded media (avatars, audio) is stored in our storage bucket. All data
              is encrypted in transit via HTTPS.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Public Content</h2>
            <p>
              Any content you publish on your public profile (username, display name, bio, links,
              avatar, embeds) is visible to anyone who visits your page. Do not post personal or
              sensitive information you do not want to be public.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">6. Third-Party Integrations</h2>
            <p>
              If you connect third-party services (such as Discord), those services may share
              limited account information with us. We only store what is necessary to display your
              integration on your profile. Third-party content embeds (YouTube, Spotify) are
              served by those platforms and subject to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">7. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. You may request
              deletion of your account at any time by contacting us. Analytics data may be
              retained in aggregate, anonymized form after account deletion.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">8. Your Rights</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Access — you can view all data stored in your dashboard</li>
              <li>Correction — you can edit your profile and settings at any time</li>
              <li>Deletion — you can delete your account from Settings</li>
              <li>Opt-out — you can make your profile private at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">9. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for individuals under the age of 13. We do not
              knowingly collect data from children. If you believe we have collected data from a
              child, please contact us for immediate removal.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of
              significant changes. Continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">11. Contact</h2>
            <p>
              Questions about this Privacy Policy can be directed to us through the contact
              information provided on the Service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

import Footer from "@/components/Footer";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-8 md:px-6 md:pb-12">
        <div className="mx-auto max-w-3xl">
          <h1
            className="mb-6 text-2xl font-semibold md:mb-8 md:text-3xl"
            style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
          >
            Terms of Use (Terms &amp; Conditions)
          </h1>

          <div
            className="space-y-4 text-sm leading-relaxed md:text-base"
            style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
          >
            <p>
              These Terms of Use apply to the Eati: AI Calorie Tracker mobile application (hereby referred to as the
              &quot;Application&quot;), provided by the Service Provider on a Freemium basis. By downloading,
              installing, or using the Application, you agree to be bound by these Terms. If you do not agree to these
              Terms, please do not use the Application.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">1. Use of the Application</h2>
            <p>
              The Application is designed to help users track nutrition, calories, and dietary habits using artificial
              intelligence features. You agree to use the Application only for lawful purposes and in accordance with
              these Terms. You must not misuse the Application or attempt to access it using methods other than the
              interface provided. The Application is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without
              warranties of any kind.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use the Application. By using the Application, you confirm that you
              meet this requirement. If you are under 18, you must have permission from a parent or legal guardian.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">3. Account and User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-5">
              <li>Providing accurate information when using the Application</li>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
            </ul>
            <p>
              The Service Provider is not responsible for any loss or damage resulting from unauthorized use of your
              account.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">4. AI Features Disclaimer</h2>
            <p>
              The Application uses artificial intelligence to estimate calories, provide recommendations, and generate
              insights. You acknowledge that:
            </p>
            <ul className="list-disc pl-5">
              <li>AI-generated results may not always be accurate</li>
              <li>Nutritional estimates are approximations</li>
              <li>The Application does not provide medical or dietary advice</li>
            </ul>
            <p>
              The Application is not a substitute for professional medical, nutritional, or fitness advice. Always
              consult qualified professionals before making health-related decisions.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">5. Subscriptions and Payments</h2>
            <p>
              The Application may offer premium features through auto-renewable subscriptions. By purchasing a
              subscription, you agree that:
            </p>
            <ul className="list-disc pl-5">
              <li>Payments will be charged to your Apple ID account at confirmation of purchase</li>
              <li>
                Subscriptions automatically renew unless canceled at least 24 hours before the end of the current
                billing period
              </li>
              <li>You can manage or cancel subscriptions in your Apple Account Settings</li>
              <li>All purchases are handled by Apple and are subject to Apple’s payment terms</li>
            </ul>

            <h2 className="pt-4 text-base font-semibold md:text-lg">6. Intellectual Property</h2>
            <p>
              All content, features, design, branding, and software within the Application are the intellectual
              property of the Service Provider. You may not:
            </p>
            <ul className="list-disc pl-5">
              <li>Copy, modify, or distribute any part of the Application</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use the Application’s branding without permission</li>
            </ul>

            <h2 className="pt-4 text-base font-semibold md:text-lg">7. Data and Privacy</h2>
            <p>
              Your use of the Application is also governed by our Privacy Policy. By using the Application, you
              consent to the collection and use of information as described in the Privacy Policy.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">8. Third-Party Services</h2>
            <p>
              The Application may integrate with third-party services (e.g., subscription management and analytics
              tools). These services operate under their own terms and privacy policies, and the Service Provider is
              not responsible for their practices.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, the Service Provider shall not be liable for any indirect,
              incidental, or consequential damages; loss of data, profits, or health-related outcomes; or decisions
              made based on AI-generated recommendations. Use of the Application is at your own risk.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">10. Termination</h2>
            <p>
              The Service Provider reserves the right to suspend or terminate your access to the Application at any
              time if you violate these Terms or misuse the service. You may stop using the Application at any time by
              uninstalling it.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">11. Changes to the Terms</h2>
            <p>
              The Service Provider may update these Terms from time to time. Continued use of the Application after
              changes constitutes acceptance of the revised Terms. Users are encouraged to review the Terms
              periodically.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">12. Governing Law</h2>
            <p>
              These Terms shall be governed and interpreted in accordance with applicable international laws and
              regulations, without regard to conflict of law principles.
            </p>

            <h2 className="pt-4 text-base font-semibold md:text-lg">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact the Service Provider at
              gymboteam@gmail.com.
            </p>

            <p className="pt-4 text-sm text-gray-600">
              Effective Date: <span>2026-01-26</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


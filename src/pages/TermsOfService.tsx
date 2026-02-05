import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            By using Ride The Tide, you acknowledge that all information provided is for educational and research purposes only. 
            This website does not provide medical advice, diagnosis, or treatment recommendations.
          </AlertDescription>
        </Alert>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Ride The Tide, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use this website or application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Educational Purpose Only</h2>
            <p className="text-muted-foreground mb-4">
              All content on Ride The Tide is provided for educational and informational purposes only. The information presented:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Is NOT medical advice and should not be treated as such</li>
              <li>Should NOT be used to diagnose, treat, cure, or prevent any disease</li>
              <li>Does NOT replace consultation with qualified healthcare providers</li>
              <li>Reflects research findings that may not translate to human applications</li>
              <li>May not be complete, accurate, or up-to-date</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Research Information Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              Dosing information, protocols, and research data presented on this website:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Are derived from published scientific literature and clinical trials</li>
              <li>Represent doses used in research contexts, NOT recommendations</li>
              <li>May involve compounds that are not approved for human use</li>
              <li>Should only be used for legitimate research and educational purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. No Endorsement</h2>
            <p className="text-muted-foreground">
              Ride The Tide does not sell peptides or any substances. We do not endorse, recommend, or promote any vendors, sources, or suppliers. 
              The inclusion of any compound in our database does not constitute an endorsement of its use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. User Responsibilities</h2>
            <p className="text-muted-foreground mb-4">As a user of this website, you agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Use information responsibly and for lawful purposes only</li>
              <li>Consult qualified healthcare providers before making health decisions</li>
              <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              <li>Not rely solely on this website for health-related decisions</li>
              <li>Verify information independently before acting on it</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Account & Membership</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account or subscribe to our membership:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>Membership subscriptions are billed monthly at €9.99</li>
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Refunds are subject to our refund policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on Ride The Tide, including text, graphics, logos, and software, is the property of Ride The Tide or its content providers 
              and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the fullest extent permitted by law, Ride The Tide and its operators:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Are not liable for any damages arising from use of this website</li>
              <li>Are not liable for any health consequences resulting from information provided</li>
              <li>Make no warranties about the accuracy or completeness of content</li>
              <li>Are not responsible for third-party links or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Ride The Tide, its operators, and affiliates from any claims, damages, or expenses 
              arising from your use of this website or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms of Service shall be governed by and construed in accordance with the laws of the European Union. 
              Any disputes arising from these terms shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms of Service at any time. Continued use of the website after changes 
              constitutes acceptance of the new terms. We encourage you to review these terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Contact</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@ridethetide.app" className="text-primary hover:underline">
                legal@ridethetide.app
              </a>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
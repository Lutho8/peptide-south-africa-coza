import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            The information provided on this website is for educational and informational purposes only. 
            It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-2">Disclaimer</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-destructive">This Is Not Medical Advice</h2>
            <p className="text-muted-foreground">
              The information provided on Ride The Tide is for <strong>educational and informational purposes only</strong>. 
              It is not intended as a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Educational Purpose</h2>
            <p className="text-muted-foreground mb-4">
              Ride The Tide is a research-focused database and tracking tool designed to provide educational information about peptides. Our content is:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Compiled from publicly available scientific literature and research studies</li>
              <li>Intended to help users understand peptide mechanisms, research status, and scientific findings</li>
              <li>Not intended to promote, encourage, or provide guidance for the use of any substances</li>
              <li>Not a recommendation for any specific treatment or protocol</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Research Compounds</h2>
            <p className="text-muted-foreground mb-4">Many peptides featured on this website are:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Not FDA approved</strong> for human use</li>
              <li>Classified as research compounds or investigational drugs</li>
              <li>Still undergoing clinical trials or preclinical research</li>
              <li>Subject to varying legal status depending on jurisdiction</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              The inclusion of any peptide on this website does not imply that it is safe, effective, or legal to use. 
              Users are responsible for understanding and complying with all applicable laws in their jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Dosage Information</h2>
            <p className="text-muted-foreground mb-4">Any dosage information presented on this website:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Is derived from published research studies and clinical trials</li>
              <li>Is provided for educational reference only</li>
              <li>Should not be interpreted as recommended dosages</li>
              <li>May not be appropriate for all individuals</li>
              <li>Does not account for individual health conditions, medications, or contraindications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. No Liability</h2>
            <p className="text-muted-foreground mb-4">Ride The Tide and its operators:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Make no warranties or representations about the accuracy, completeness, or reliability of any information on this website</li>
              <li>Are not responsible for any decisions made based on information found on this website</li>
              <li>Disclaim all liability for any damages, injuries, or losses resulting from the use of information presented here</li>
              <li>Do not endorse any specific vendors, products, or treatments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Accuracy of Information</h2>
            <p className="text-muted-foreground">
              While we strive to provide accurate and up-to-date information based on current research, science evolves rapidly. 
              Information may become outdated, and new research may contradict previously held beliefs. 
              We encourage users to verify information through primary sources and consult with qualified professionals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Third-Party Links</h2>
            <p className="text-muted-foreground">
              This website may contain links to external websites, research papers, and other resources. 
              We are not responsible for the content, accuracy, or availability of these external sites. 
              The inclusion of any link does not imply endorsement of the linked site or its content.
            </p>
          </section>

          <section className="mb-8 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-destructive">7. Consult Healthcare Professionals</h2>
            <p className="text-muted-foreground mb-4">Before considering any peptide or treatment:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Consult with a qualified healthcare provider</li>
              <li>Discuss your complete medical history and current medications</li>
              <li>Understand the potential risks, side effects, and interactions</li>
              <li>Ensure proper medical supervision if pursuing any treatment</li>
              <li><strong>Never self-diagnose or self-treat based on information found online</strong></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this disclaimer or our content policies, please contact us at{' '}
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
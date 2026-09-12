import { Link } from 'react-router-dom';
import { MeasurementToolScreen } from '@/screens/MeasurementToolScreen';
import { SEOHead } from '@/components/seo/SEOHead';
export default function CalculatorPage() {
  return <main className="container mx-auto max-w-6xl px-4 py-6">
    <SEOHead title="U-40 & U-100 Reconstitution Calculator | Peptide South Africa" description="Convert a user-entered amount between mg, mcg, mL and U-40 or U-100 syringe markings using the exact vial concentration." canonical="https://www.peptide-south-africa.co.za/calculator" />
    <Link to="/?tab=measurement" className="mb-5 inline-block text-sm text-primary underline">Open your tracking dashboard</Link>
    <MeasurementToolScreen calculatorOnly />
  </main>;
}

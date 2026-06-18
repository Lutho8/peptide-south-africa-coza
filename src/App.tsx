import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import PeptideTherapy from './pages/PeptideTherapy'
import PharmacyStandards from './pages/PharmacyStandards'
import Pricing from './pages/Pricing'
import ResearchVsPrescribed from './pages/ResearchVsPrescribed'
import WeightLoss from './pages/WeightLoss'
import Longevity from './pages/Longevity'
import Recovery from './pages/Recovery'
import ProductTirzepatide from './pages/ProductTirzepatide'
import ProductSemaglutide from './pages/ProductSemaglutide'
import ProductNAD from './pages/ProductNAD'
import ProductSermorelin from './pages/ProductSermorelin'
import ProductGlutathione from './pages/ProductGlutathione'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import FAQs from './pages/FAQs'
import FAQPage from './pages/FAQPage'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Returns from './pages/Returns'
import Hipaa from './pages/Hipaa'
import NotFound from './pages/NotFound'
import PeptideDatabase from './pages/PeptideDatabase'
import Assessment from './pages/Assessment'

// Program pages
import WeightLossProgram from './pages/programs/WeightLoss'
import LongevityProgram from './pages/programs/Longevity'
import MetabolicResetProgram from './pages/programs/MetabolicReset'
import MuscleRecoveryProgram from './pages/programs/MuscleRecovery'
import SportsPerformanceProgram from './pages/programs/SportsPerformance'

// Compound pages
import SemaglutidePage from './pages/peptides/Semaglutide'
import TirzepatidePage from './pages/peptides/Tirzepatide'
import BPC157Page from './pages/peptides/BPC157'
import TB500Page from './pages/peptides/TB500'
import CJC1295IpamorelinPage from './pages/peptides/CJC1295Ipamorelin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="peptide-therapy" element={<PeptideTherapy />} />
        <Route path="pharmacy-standards" element={<PharmacyStandards />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="research-vs-prescribed" element={<ResearchVsPrescribed />} />
        <Route path="weight-loss" element={<WeightLoss />} />
        <Route path="longevity" element={<Longevity />} />
        <Route path="recovery" element={<Recovery />} />
        <Route path="products/compounded-tirzepatide" element={<ProductTirzepatide />} />
        <Route path="products/compounded-semaglutide" element={<ProductSemaglutide />} />
        <Route path="products/nad" element={<ProductNAD />} />
        <Route path="products/sermorelin" element={<ProductSermorelin />} />
        <Route path="products/glutathione" element={<ProductGlutathione />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:slug" element={<BlogPost />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact-us" element={<Contact />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="terms-conditions" element={<Terms />} />
        <Route path="return-policy" element={<Returns />} />
        <Route path="hippa-privacy-policy" element={<Hipaa />} />
        
        {/* New Program Pages */}
        <Route path="programs/weight-loss" element={<WeightLossProgram />} />
        <Route path="programs/longevity" element={<LongevityProgram />} />
        <Route path="programs/metabolic-reset" element={<MetabolicResetProgram />} />
        <Route path="programs/muscle-recovery" element={<MuscleRecoveryProgram />} />
        <Route path="programs/sports-performance" element={<SportsPerformanceProgram />} />
        
        {/* New Compound Pages */}
        <Route path="peptides/semaglutide" element={<SemaglutidePage />} />
        <Route path="peptides/tirzepatide" element={<TirzepatidePage />} />
        <Route path="peptides/bpc-157" element={<BPC157Page />} />
        <Route path="peptides/tb-500" element={<TB500Page />} />
        <Route path="peptides/cjc-1295-ipamorelin" element={<CJC1295IpamorelinPage />} />
        
        {/* New Hub Pages */}
        <Route path="peptide-database" element={<PeptideDatabase />} />
        <Route path="assessment" element={<Assessment />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

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
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Returns from './pages/Returns'
import Hipaa from './pages/Hipaa'
import NotFound from './pages/NotFound'

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
        <Route path="contact-us" element={<Contact />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="terms-conditions" element={<Terms />} />
        <Route path="return-policy" element={<Returns />} />
        <Route path="hippa-privacy-policy" element={<Hipaa />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

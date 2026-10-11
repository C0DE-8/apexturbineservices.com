import { useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, Cable, CircleCheck, ClipboardList, Clock3, Cog, Factory, Fan, FlaskConical, Fuel, Gauge, Handshake, HardHat, Mail, MapPin, MessageSquareText, Phone, Pickaxe, Play, Plus, SearchCheck, ShieldCheck, SlidersHorizontal, Target, X, Zap } from 'lucide-react'
import heroPhoto from '../../assets/site/PHOTO-2026-10-09-22-43-31 2.jpg'
import aboutPhoto from '../../assets/site/PHOTO-2026-10-09-22-43-32.jpg'
import projectPhoto from '../../assets/site/PHOTO-2026-10-09-22-43-31.jpg'
import powerPhoto from '../../assets/site/PHOTO-2026-10.jpg'
import workOne from '../../assets/work_pic/work.jpg'
import workTeam from '../../assets/work_pic/PHOTO-2026-10-09-22.jpg'
import workTwo from '../../assets/work_pic/PHOTO-2026-10-09-22-43-33.jpg'
import workThree from '../../assets/work_pic/PHOTO-2026-10-09-22-43-34.jpg'
import '../../App.css'

const logo = '/apex-logo.png'

const services = [
  { icon: Fan, title: 'Gas Turbine Installation', copy: 'Installation of industrial gas turbine equipment, including mechanical, electrical and auxiliary systems.' },
  { icon: Gauge, title: 'Turbine Commissioning', copy: 'System checks, startup preparation, operational testing and performance verification.' },
  { icon: Cog, title: 'Generator Installation and Integration', copy: 'Integration of generators with turbines, electrical systems, protection equipment and controls.' },
  { icon: SearchCheck, title: 'Inspection & Maintenance', copy: 'Preventive maintenance, fault diagnosis and coordination of repairs.' },
  { icon: SlidersHorizontal, title: 'Control Systems & Instrumentation', copy: 'Integration and testing of monitoring systems, alarms and turbine control equipment.' },
  { icon: Factory, title: 'Industrial Power Plant Engineering', copy: 'Engineering coordination and technical support for new installations, upgrades and power projects.' },
]

const industries = [
  { icon: Zap, name: 'Power Generation', photo: powerPhoto },
  { icon: Fuel, name: 'Oil & Gas', photo: projectPhoto },
  { icon: Cog, name: 'Manufacturing', photo: aboutPhoto },
  { icon: FlaskConical, name: 'Petrochemical', photo: powerPhoto },
  { icon: Pickaxe, name: 'Mining', photo: projectPhoto },
  { icon: Cable, name: 'Utilities', photo: powerPhoto },
  { icon: Building2, name: 'Industrial Infrastructure', photo: aboutPhoto },
]

const trustPoints = [
  { icon: ShieldCheck, label: 'Safety First' },
  { icon: Target, label: 'Engineering Precision' },
  { icon: Clock3, label: 'On-Time Delivery' },
  { icon: Handshake, label: 'Long-Term Partnerships' },
]

const processSteps = [
  ['01', 'Consultation', 'Understand your needs, review equipment and define project objectives.', MessageSquareText],
  ['02', 'Engineering & Planning', 'Review specifications, site requirements, installation plans and safety considerations.', ClipboardList],
  ['03', 'Installation', 'Coordinate equipment, mechanical and electrical installation and auxiliary systems.', HardHat],
  ['04', 'Testing & Commissioning', 'Complete inspections, functional checks, startup and performance verification.', CircleCheck],
  ['05', 'Handover & Support', 'Provide documentation, training and ongoing technical support.', BadgeCheck],
]

const projects = [
  { photo: workOne, title: 'Industrial Gas Turbine Installation', detail: 'Power Generation  |  USA' },
  { photo: workTeam, title: 'Turbine Installation Team', detail: 'Power Generation  |  USA' },
  { photo: workTwo, title: 'Generator Integration Project', detail: 'Manufacturing  |  USA' },
  { photo: workThree, title: 'Turbine Commissioning', detail: 'Oil & Gas  |  Middle East' },
]

const faqs = [
  ['What turbine services does Apex provide?', 'Apex supports industrial gas turbine installation, generator integration, commissioning, inspections, maintenance coordination, control systems and power plant engineering.'],
  ['Can Apex support a project from installation through startup?', 'Yes. Project support can span planning, equipment installation, integration, inspection, functional testing, commissioning and handover, based on the project scope.'],
  ['What information should I include in a project inquiry?', 'Share your facility location, equipment or turbine model, project stage, target schedule and the support you need. The Apex team can use those details to understand the project and discuss next steps.'],
]
const navigation = ['Home', 'About Us', 'Services', 'Industries', 'Projects', 'Safety & Quality', 'Careers', 'Insights', 'Contact']
const navHref = (item) => ({ Home: '#home', 'About Us': '#about-us', Services: '#services', Industries: '#industries', Projects: '#projects', 'Safety & Quality': '#safety-and-quality', Careers: 'mailto:apexturbineservices@gmail.com?subject=Careers%20at%20Apex', Insights: '#insights', Contact: '#contact' })[item]

function ArrowLink({ children, href = '#contact', outline = false }) {
  return <a className={`button${outline ? ' button-outline' : ''}`} href={href}>{children}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" /></a>
}

function ImageSlider({ items, label, className = '' }) {
  const [active, setActive] = useState(0)
  const move = (step) => setActive((current) => (current + step + items.length) % items.length)

  return (
    <div className={`image-slider ${className}`} aria-label={label}>
      <div className="slider-track" style={{ '--slide-index': active }}>
          {items.map((item) => (
          <article className="slider-slide" key={item.name || item.title}>
            <img src={item.photo} alt={item.alt || ''} />
            <span className="slide-caption"><b>{item.name || item.title}</b>{item.detail && <small>{item.detail}</small>}</span>
          </article>
        ))}
      </div>
      <div className="slider-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous image"><ArrowLeft size={17} aria-hidden="true" /></button>
        <div className="slider-dots">{items.map((item, index) => <button type="button" key={item.name || item.title} className={active === index ? 'selected' : ''} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} aria-current={active === index ? 'true' : undefined} />)}</div>
        <button type="button" onClick={() => move(1)} aria-label="Next image"><ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <header className="site-header">
        <a href="#home" className="brand" aria-label="Apex Turbine Services home"><img src={logo} alt="Apex Turbine Services" /></a>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => <a className={item === 'Home' ? 'active' : ''} href={navHref(item)} key={item}>{item}</a>)}
        </nav>
        <ArrowLink href="#contact">Request a Quote</ArrowLink>
        <div className="phone-link"><Phone aria-hidden="true" size={15} strokeWidth={2.2} /><span><a href="tel:+12562887649">+1 (256) 288-7649</a></span></div>
        <details className="mobile-menu"><summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary><nav aria-label="Mobile navigation">{navigation.map((item) => <a href={navHref(item)} key={item}>{item}</a>)}</nav></details>
      </header>

      <main>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Apex Turbine Services',
          url: 'https://www.apexturbineservices.com/',
          logo: 'https://www.apexturbineservices.com/apex-logo.png',
          email: 'apexturbineservices@gmail.com',
          telephone: ['+1-256-288-7649'],
          address: { '@type': 'PostalAddress', addressLocality: 'Huntsville', addressRegion: 'AL', postalCode: '35801', addressCountry: 'US' },
          description: 'Industrial gas turbine installation, generator integration, commissioning, inspection, maintenance coordination and engineering support.',
          hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Turbine and power generation services', itemListElement: services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.title, description: service.copy } })) },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
        })}</script>
        <section className="hero-section" id="home" style={{ '--hero-image': `url("${heroPhoto}")` }}>
          <div className="hero-copy">
            <p className="eyebrow">Industrial Engineering <i /> Power Generation <i /> Global Reach</p>
            <h1>Powering Industry<br />Through Precision<br />Engineering</h1>
            <p className="hero-subtitle">Gas Turbine Installation. Power Generation Solutions. Industrial Excellence.</p>
            <p className="hero-description">We provide gas turbine installation, system integration, commissioning, and technical support for power generation facilities and industrial operations.</p>
            <div className="hero-actions"><ArrowLink href="#services">Explore Our Services</ArrowLink><ArrowLink href="#contact" outline>Request a Project Quote</ArrowLink></div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading"><h2>Our Core Services</h2><p>Complete turbine solutions from installation to ongoing support.</p></div>
          <div className="service-grid">{services.map((service) => { const Icon = service.icon; return <article className="service-card" key={service.title}><div className="service-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.8} /></div><h3>{service.title}</h3><p>{service.copy}</p><a href="#contact">Learn More <ArrowRight size={13} aria-hidden="true" /></a></article> })}</div>
        </section>

        <section className="proof-band" aria-label="Apex project support">
          <div><span aria-hidden="true">01</span><p><b>Full project lifecycle</b><small>Planning, installation, commissioning and handover</small></p></div>
          <div><span aria-hidden="true">02</span><p><b>Safety-led execution</b><small>Site coordination and safety planning at every stage</small></p></div>
          <div><span aria-hidden="true">03</span><p><b>Integrated expertise</b><small>Mechanical, electrical, generator and control systems</small></p></div>
          <div><span aria-hidden="true">04</span><p><b>Ongoing support</b><small>Inspection, maintenance coordination and technical support</small></p></div>
        </section>

        <section className="about-section" id="about-us">
          <img className="about-image" src={aboutPhoto} alt="Technicians inspecting a gas turbine installation" />
          <div className="about-copy"><p className="eyebrow blue">About Us</p><h2>Your Partner in Turbine<br className="desktop-break" /> Installation and Power Generation</h2><p>Apex Turbine Services is an industrial engineering company specializing in gas turbine installation, generator integration, commissioning and technical support for power plants and industrial facilities. We help our clients achieve reliable, efficient and safe power generation through expert engineering, skilled teams and a commitment to excellence.</p><div className="trust-points">{trustPoints.map(({ icon: Icon, label }) => <span key={label}><Icon size={17} strokeWidth={1.9} aria-hidden="true" /><b>{label}</b></span>)}</div><ArrowLink href="#about-us">Learn More About Us</ArrowLink></div>
        </section>

        <section className="section industries-section" id="industries">
          <div className="section-heading"><h2>Industries We Serve</h2><p>We work with a wide range of industries, delivering reliable turbine solutions for diverse applications.</p></div>
          <div className="industry-grid">{industries.map((industry) => { const Icon = industry.icon; return <a href="#contact" className="industry-card" key={industry.name}><img src={industry.photo} alt="" /><span><b aria-hidden="true"><Icon size={16} strokeWidth={2} /></b>{industry.name}</span></a> })}</div>
          <ImageSlider className="industry-slider" items={industries.map((industry) => ({ ...industry, title: industry.name }))} label="Industries gallery" />
        </section>

        <section className="process-section" id="safety-and-quality">
          <div className="section-heading"><h2>Our Engineering Process</h2><p>A structured approach for successful project delivery.</p></div>
          <div className="process-grid">{processSteps.map(([number, title, copy, Icon]) => <article className="process-step" key={number}><div className="step-top"><b>{number}</b><span aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="insights-section" id="insights">
          <div className="section-heading"><p className="eyebrow blue">Planning Resources</p><h2>Practical Answers for Turbine Projects</h2><p>Start a conversation with the right project details and questions.</p></div>
          <div className="insight-grid">
            <article><span className="insight-number">01 / PROJECT PLANNING</span><h3>Preparing for a turbine installation</h3><p>Equipment information, site readiness, tie-in requirements and project schedule all help shape an installation plan.</p><a href="#faq">See common questions <ArrowRight size={13} aria-hidden="true" /></a></article>
            <article><span className="insight-number">02 / COMMISSIONING</span><h3>From installation to startup</h3><p>Integration checks, inspections and functional testing help prepare equipment for commissioning and handover.</p><a href="#faq">See common questions <ArrowRight size={13} aria-hidden="true" /></a></article>
            <article><span className="insight-number">03 / MAINTENANCE</span><h3>Planning ongoing support</h3><p>Clear equipment history, operating context and site constraints help teams plan inspection and maintenance work.</p><a href="#faq">See common questions <ArrowRight size={13} aria-hidden="true" /></a></article>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-intro"><p className="eyebrow blue">FAQ</p><h2>Questions About Working With Apex</h2><p>Need help with a specific turbine or facility? Send our team a project inquiry.</p><ArrowLink href="mailto:apexturbineservices@gmail.com">Talk to Our Team</ArrowLink></div>
          <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="projects-section" id="projects">
          <div className="projects-backdrop" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,31,59,.94), rgba(2,31,59,.55)), url("${projectPhoto}")` }} />
          <div className="projects-intro"><p className="eyebrow">Featured Projects</p><h2>Proven Experience. Real Results.</h2><p>Explore some of our recent turbine installation and commissioning projects across multiple industries and locations.</p><ArrowLink href="#projects" outline>View All Projects</ArrowLink></div>
          <div className="project-grid">{projects.map((project, index) => <article className={`project-card${index === 0 ? ' project-card-man' : ''}`} key={project.title}><img src={project.photo} alt="" /><div><h3>{project.title}</h3><p>{project.detail}</p><a href="#contact">View Project <ArrowRight size={13} aria-hidden="true" /></a></div></article>)}</div>
          <ImageSlider className="project-slider" items={projects.map((project) => ({ photo: project.photo, title: project.title, detail: project.detail, alt: `Turbine project: ${project.title}` }))} label="Featured projects gallery" />
        </section>

        <section className="contact-band" id="contact" style={{ '--contact-image': `url("${powerPhoto}")` }}><div><p className="eyebrow">Let’s Build a More Reliable Energy Future</p><p>Contact us today to discuss your project requirements and find out how<br className="desktop-break" /> Apex Turbine Solutions can support your business.</p></div><ArrowLink href="mailto:apexturbineservices@gmail.com" outline>Contact Us</ArrowLink><div className="contact-details"><a href="tel:+12562887649"><Phone size={15} aria-hidden="true" />+1 (256) 288-7649</a><a href="mailto:apexturbineservices@gmail.com"><Mail size={15} aria-hidden="true" />apexturbineservices@gmail.com</a><span><MapPin size={15} aria-hidden="true" />Huntsville, AL 35801, USA</span></div></section>
      </main>

      <footer className="site-footer"><div className="footer-main"><a href="#home" className="brand footer-brand"><img src={logo} alt="Apex Turbine Services" /></a><nav aria-label="Footer navigation">{navigation.map((item) => <a key={item} href={navHref(item)}>{item}</a>)}</nav><div className="social-links"><a href="#contact" aria-label="LinkedIn"><BriefcaseBusiness size={16} aria-hidden="true" /></a><a href="#contact" aria-label="YouTube"><Play size={16} aria-hidden="true" /></a><a href="#contact" aria-label="X"><X size={16} aria-hidden="true" /></a></div></div><div className="footer-bottom"><span>© 2025 Apex Turbine Solutions. All rights reserved.</span><span>Engineering Today. Powering Tomorrow.</span></div></footer>
    </>
  )
}

export default App

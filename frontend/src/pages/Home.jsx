import { useState } from 'react'
import heroPhoto from '../assets/site/PHOTO-2026-10-09-22-43-31 2.jpg'
import aboutPhoto from '../assets/site/PHOTO-2026-10-09-22-43-32.jpg'
import projectPhoto from '../assets/site/PHOTO-2026-10-09-22-43-31.jpg'
import powerPhoto from '../assets/site/PHOTO-2026-10.jpg'
import workOne from '../assets/work_pic/PHOTO-2026-10-09-22-43-32.jpg'
import workTwo from '../assets/work_pic/PHOTO-2026-10-09-22-43-33.jpg'
import workThree from '../assets/work_pic/PHOTO-2026-10-09-22-43-34.jpg'
import '../App.css'

const logo = '/apex-logo.png'

const services = [
  { icon: '◉', title: 'Gas Turbine Installation', copy: 'Installation of industrial gas turbine equipment, including mechanical, electrical and auxiliary systems.' },
  { icon: '▣', title: 'Turbine Commissioning', copy: 'System checks, startup preparation, operational testing and performance verification.' },
  { icon: '⚙', title: 'Generator Installation and Integration', copy: 'Integration of generators with turbines, electrical systems, protection equipment and controls.' },
  { icon: '⌕', title: 'Inspection & Maintenance', copy: 'Preventive maintenance, fault diagnosis and coordination of repairs.' },
  { icon: '▤', title: 'Control Systems & Instrumentation', copy: 'Integration and testing of monitoring systems, alarms and turbine control equipment.' },
  { icon: '▥', title: 'Industrial Power Plant Engineering', copy: 'Engineering coordination and technical support for new installations, upgrades and power projects.' },
]

const industries = [
  { icon: 'ϟ', name: 'Power Generation', photo: powerPhoto },
  { icon: '◈', name: 'Oil & Gas', photo: projectPhoto },
  { icon: '⚙', name: 'Manufacturing', photo: aboutPhoto },
  { icon: '♜', name: 'Petrochemical', photo: powerPhoto },
  { icon: '⚒', name: 'Mining', photo: projectPhoto },
  { icon: 'ϟ', name: 'Utilities', photo: powerPhoto },
  { icon: '▥', name: 'Industrial Infrastructure', photo: aboutPhoto },
]

const projects = [
  { photo: workOne, title: 'Industrial Gas Turbine Installation', detail: 'Power Generation  |  USA' },
  { photo: workTwo, title: 'Generator Integration Project', detail: 'Manufacturing  |  USA' },
  { photo: workThree, title: 'Turbine Commissioning', detail: 'Oil & Gas  |  Middle East' },
]

const faqs = [
  ['What turbine services does Apex provide?', 'Apex supports industrial gas turbine installation, generator integration, commissioning, inspections, maintenance coordination, control systems and power plant engineering.'],
  ['Can Apex support a project from installation through startup?', 'Yes. Project support can span planning, equipment installation, integration, inspection, functional testing, commissioning and handover, based on the project scope.'],
  ['What information should I include in a project inquiry?', 'Share your facility location, equipment or turbine model, project stage, target schedule and the support you need. The Apex team can use those details to understand the project and discuss next steps.'],
]
const navigation = ['Home', 'About Us', 'Services', 'Industries', 'Projects', 'Safety & Quality', 'Careers', 'Insights', 'Contact']
const navHref = (item) => ({ Home: '#home', 'About Us': '#about-us', Services: '#services', Industries: '#industries', Projects: '#projects', 'Safety & Quality': '#safety-and-quality', Careers: 'mailto:info@apexturbinesolutions.com?subject=Careers%20at%20Apex', Insights: '#insights', Contact: '#contact' })[item]

function ArrowLink({ children, href = '#contact', outline = false }) {
  return <a className={`button${outline ? ' button-outline' : ''}`} href={href}>{children}<span aria-hidden="true">→</span></a>
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
        <button type="button" onClick={() => move(-1)} aria-label="Previous image">←</button>
        <div className="slider-dots">{items.map((item, index) => <button type="button" key={item.name || item.title} className={active === index ? 'selected' : ''} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} aria-current={active === index ? 'true' : undefined} />)}</div>
        <button type="button" onClick={() => move(1)} aria-label="Next image">→</button>
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
        <a className="phone-link" href="tel:+12565550187">☎ <span>+1 (256) 555-0187</span></a>
        <details className="mobile-menu"><summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary><nav aria-label="Mobile navigation">{navigation.map((item) => <a href={navHref(item)} key={item}>{item}</a>)}</nav></details>
      </header>

      <main>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Apex Turbine Services',
          url: 'https://www.apexturbineservices.com/',
          logo: 'https://www.apexturbineservices.com/apex-logo.png',
          email: 'info@apexturbinesolutions.com',
          telephone: '+1-256-555-0187',
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
          <div className="service-grid">{services.map((service) => <article className="service-card" key={service.title}><div className="service-icon" aria-hidden="true">{service.icon}</div><h3>{service.title}</h3><p>{service.copy}</p><a href="#contact">Learn More <span>→</span></a></article>)}</div>
        </section>

        <section className="proof-band" aria-label="Apex project support">
          <div><span aria-hidden="true">01</span><p><b>Full project lifecycle</b><small>Planning, installation, commissioning and handover</small></p></div>
          <div><span aria-hidden="true">02</span><p><b>Safety-led execution</b><small>Site coordination and safety planning at every stage</small></p></div>
          <div><span aria-hidden="true">03</span><p><b>Integrated expertise</b><small>Mechanical, electrical, generator and control systems</small></p></div>
          <div><span aria-hidden="true">04</span><p><b>Ongoing support</b><small>Inspection, maintenance coordination and technical support</small></p></div>
        </section>

        <section className="about-section" id="about-us">
          <img className="about-image" src={aboutPhoto} alt="Technicians inspecting a gas turbine installation" />
          <div className="about-copy"><p className="eyebrow blue">About Us</p><h2>Your Partner in Turbine<br className="desktop-break" /> Installation and Power Generation</h2><p>Apex Turbine Services is an industrial engineering company specializing in gas turbine installation, generator integration, commissioning and technical support for power plants and industrial facilities. We help our clients achieve reliable, efficient and safe power generation through expert engineering, skilled teams and a commitment to excellence.</p><div className="trust-points"><span>⛨ <b>Safety First</b></span><span>✥ <b>Engineering Precision</b></span><span>◷ <b>On-Time Delivery</b></span><span>◉ <b>Long-Term Partnerships</b></span></div><ArrowLink href="#about-us">Learn More About Us</ArrowLink></div>
        </section>

        <section className="section industries-section" id="industries">
          <div className="section-heading"><h2>Industries We Serve</h2><p>We work with a wide range of industries, delivering reliable turbine solutions for diverse applications.</p></div>
          <div className="industry-grid">{industries.map((industry) => <a href="#contact" className="industry-card" key={industry.name}><img src={industry.photo} alt="" /><span><b aria-hidden="true">{industry.icon}</b>{industry.name}</span></a>)}</div>
          <ImageSlider className="industry-slider" items={industries.map((industry) => ({ ...industry, title: industry.name }))} label="Industries gallery" />
        </section>

        <section className="process-section" id="safety-and-quality">
          <div className="section-heading"><h2>Our Engineering Process</h2><p>A structured approach for successful project delivery.</p></div>
          <div className="process-grid">{[
            ['01', 'Consultation', 'Understand your needs, review equipment and define project objectives.'],
            ['02', 'Engineering & Planning', 'Review specifications, site requirements, installation plans and safety considerations.'],
            ['03', 'Installation', 'Coordinate equipment, mechanical and electrical installation and auxiliary systems.'],
            ['04', 'Testing & Commissioning', 'Complete inspections, functional checks, startup and performance verification.'],
            ['05', 'Handover & Support', 'Provide documentation, training and ongoing technical support.'],
          ].map(([number, title, copy]) => <article className="process-step" key={number}><div className="step-top"><b>{number}</b><span aria-hidden="true">{['▱', '☷', '◉', '✓', '▣'][Number(number) - 1]}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="insights-section" id="insights">
          <div className="section-heading"><p className="eyebrow blue">Planning Resources</p><h2>Practical Answers for Turbine Projects</h2><p>Start a conversation with the right project details and questions.</p></div>
          <div className="insight-grid">
            <article><span className="insight-number">01 / PROJECT PLANNING</span><h3>Preparing for a turbine installation</h3><p>Equipment information, site readiness, tie-in requirements and project schedule all help shape an installation plan.</p><a href="#faq">See common questions <span>→</span></a></article>
            <article><span className="insight-number">02 / COMMISSIONING</span><h3>From installation to startup</h3><p>Integration checks, inspections and functional testing help prepare equipment for commissioning and handover.</p><a href="#faq">See common questions <span>→</span></a></article>
            <article><span className="insight-number">03 / MAINTENANCE</span><h3>Planning ongoing support</h3><p>Clear equipment history, operating context and site constraints help teams plan inspection and maintenance work.</p><a href="#faq">See common questions <span>→</span></a></article>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-intro"><p className="eyebrow blue">FAQ</p><h2>Questions About Working With Apex</h2><p>Need help with a specific turbine or facility? Send our team a project inquiry.</p><ArrowLink href="mailto:info@apexturbinesolutions.com">Talk to Our Team</ArrowLink></div>
          <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="projects-section" id="projects">
          <div className="projects-backdrop" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,31,59,.94), rgba(2,31,59,.55)), url("${projectPhoto}")` }} />
          <div className="projects-intro"><p className="eyebrow">Featured Projects</p><h2>Proven Experience. Real Results.</h2><p>Explore some of our recent turbine installation and commissioning projects across multiple industries and locations.</p><ArrowLink href="#projects" outline>View All Projects</ArrowLink></div>
          <div className="project-grid">{projects.map((project) => <article className="project-card" key={project.title}><img src={project.photo} alt="" /><div><h3>{project.title}</h3><p>{project.detail}</p><a href="#contact">View Project <span>→</span></a></div></article>)}</div>
          <ImageSlider className="project-slider" items={projects.map((project) => ({ photo: project.photo, title: project.title, detail: project.detail, alt: `Turbine project: ${project.title}` }))} label="Featured projects gallery" />
        </section>

        <section className="contact-band" id="contact" style={{ '--contact-image': `url("${powerPhoto}")` }}><div><p className="eyebrow">Let’s Build a More Reliable Energy Future</p><p>Contact us today to discuss your project requirements and find out how<br className="desktop-break" /> Apex Turbine Solutions can support your business.</p></div><ArrowLink href="mailto:info@apexturbinesolutions.com" outline>Contact Us</ArrowLink><div className="contact-details"><a href="tel:+12565550187">☎ +1 (256) 555-0187</a><a href="mailto:info@apexturbinesolutions.com">✉ info@apexturbinesolutions.com</a><span>⌖ Huntsville, AL 35801, USA</span></div></section>
      </main>

      <footer className="site-footer"><div className="footer-main"><a href="#home" className="brand footer-brand"><img src={logo} alt="Apex Turbine Services" /></a><nav aria-label="Footer navigation">{navigation.map((item) => <a key={item} href={navHref(item)}>{item}</a>)}</nav><div className="social-links"><a href="#contact" aria-label="LinkedIn">in</a><a href="#contact" aria-label="YouTube">▶</a><a href="#contact" aria-label="X">𝕏</a></div></div><div className="footer-bottom"><span>© 2025 Apex Turbine Solutions. All rights reserved.</span><span>Engineering Today. Powering Tomorrow.</span></div></footer>
    </>
  )
}

export default App

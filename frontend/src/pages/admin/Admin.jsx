import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Image, LayoutDashboard, LogOut, Save, Settings2, ShieldCheck } from 'lucide-react'
import { getAdminSession, loginAdmin, logoutAdmin, saveAdminProfile, saveSite as saveSiteRequest, uploadImage } from '../../api/admin.js'
import { getSite } from '../../api/site.js'
import '../../App.css'
import './admin.css'

function Field({ label, value, onChange, multiline = false, type = 'text', hint }) {
  const Control = multiline ? 'textarea' : 'input'
  return <label className="admin-field"><span>{label}</span><Control type={multiline ? undefined : type} value={value || ''} onChange={(event) => onChange(event.target.value)} />{hint && <small>{hint}</small>}</label>
}

function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState('admin@admin.com')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [site, setSite] = useState(null)
  const [profile, setProfile] = useState({ email: '', currentPassword: '', newPassword: '' })
  const [active, setActive] = useState('overview')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState('')

  useEffect(() => {
    getAdminSession().then((result) => {
      if (result.authenticated) { setAuthenticated(true); setAdminEmail(result.admin.email); setProfile((current) => ({ ...current, email: result.admin.email })); return getSite().then(setSite) }
    }).catch(() => {})
  }, [])

  const login = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const result = await loginAdmin(credentials)
      setAuthenticated(true); setAdminEmail(result.admin.email); setProfile((current) => ({ ...current, email: result.admin.email })); setSite(await getSite())
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const saveSite = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try { const result = await saveSiteRequest(site); setSite(result.site); setNotice('Your website changes are live.') }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const handleImageUpload = async (key, file) => {
    if (!file) return
    setUploading(key); setError(''); setNotice('')
    try {
      const photo = await uploadImage(file)
      if (key.startsWith('project-')) {
        const index = Number(key.slice('project-'.length))
        setSite((current) => ({ ...current, projects: current.projects.map((project, i) => i === index ? { ...project, photo } : project) }))
      } else setSite((current) => ({ ...current, [key]: photo }))
      setNotice('Image uploaded. Save changes to publish it.')
    } catch (err) { setError(err.message) } finally { setUploading('') }
  }
  const saveProfile = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      const result = await saveAdminProfile(profile)
      setAdminEmail(result.admin.email); setProfile({ email: result.admin.email, currentPassword: '', newPassword: '' }); setNotice('Admin profile updated.')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const logout = async () => { await logoutAdmin().catch(() => {}); setAuthenticated(false); setSite(null) }

  if (!authenticated) return <main className="admin-login-page"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to website</a><form className="admin-login-card" onSubmit={login}><div className="admin-mark"><ShieldCheck size={25} /></div><p className="admin-kicker">APEX TURBINE SERVICES</p><h1>Admin sign in</h1><p className="admin-muted">Sign in to manage website content and settings.</p>{error && <p className="admin-alert" role="alert">{error}</p>}<Field label="Admin email" type="email" value={credentials.email} onChange={(email) => setCredentials({ ...credentials, email })} /><Field label="Password" type="password" value={credentials.password} onChange={(password) => setCredentials({ ...credentials, password })} /><button className="admin-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}<ArrowLeft className="admin-arrow" size={16} /></button><small className="admin-login-note">First sign in: admin@admin.com · 123456</small></form></main>

  const navigation = [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'content', label: 'Website content', icon: Settings2 }, { id: 'images', label: 'Images', icon: Image }, { id: 'profile', label: 'Admin profile', icon: ShieldCheck }]
  return <div className="admin-layout"><aside className="admin-sidebar"><a href="/" className="admin-brand">APEX <span>ADMIN</span></a><div className="admin-side-label">WORKSPACE</div><nav>{navigation.map(({ id, label, icon: Icon }) => <button className={active === id ? 'active' : ''} key={id} onClick={() => { setActive(id); setError(''); setNotice('') }}><Icon size={17} />{label}</button>)}</nav><div className="admin-sidebar-bottom"><a href="/"><ArrowLeft size={16} /> View website</a><button onClick={logout}><LogOut size={16} /> Sign out</button></div></aside>
    <main className="admin-main"><header className="admin-topbar"><div><span>Admin workspace</span><b>{adminEmail}</b></div><div className="admin-avatar">{adminEmail.slice(0, 1).toUpperCase()}</div></header><div className="admin-content"><div className="admin-page-heading"><div><p className="admin-kicker">CONTROL CENTER</p><h1>{navigation.find((item) => item.id === active)?.label}</h1><p>Keep your Apex website current and accurate.</p></div>{active === 'content' && <button className="admin-primary admin-save-top" form="site-form" disabled={busy}><Save size={16} />{busy ? 'Saving…' : 'Save changes'}</button>}</div>
    {notice && <div className="admin-success"><Check size={17} />{notice}</div>}{error && <div className="admin-alert" role="alert">{error}</div>}
    {!site ? <div className="admin-loading">Loading your website settings…</div> : active === 'overview' ? <><div className="admin-welcome"><div><p className="admin-kicker">GOOD TO SEE YOU</p><h2>Your website, in your hands.</h2><p>Update key messages, contact information and imagery across the public website.</p><button className="admin-primary" onClick={() => setActive('content')}>Edit website content <ArrowLeft className="admin-arrow" size={16} /></button></div><div className="admin-welcome-icon"><LayoutDashboard size={54} strokeWidth={1.2} /></div></div><div className="admin-stat-grid"><article><span>WEBSITE STATUS</span><b><i /> Online</b><small>Your public site is ready</small></article><article><span>EDITABLE SERVICES</span><b>{site.services?.length || 0}</b><small>Service cards on the homepage</small></article><article><span>ADMIN ACCOUNT</span><b className="admin-stat-email">{adminEmail}</b><small>Manage your sign-in details</small></article></div><div className="admin-tip"><ShieldCheck size={19} /><div><b>Secure your admin account</b><p>Change the starter password in Admin profile after your first sign-in.</p></div><button onClick={() => setActive('profile')}>Open profile</button></div></> : active === 'profile' ? <form className="admin-panel admin-form" onSubmit={saveProfile}><div className="admin-panel-title"><div className="admin-panel-icon"><ShieldCheck size={19} /></div><div><h2>Admin profile</h2><p>Update the email address or password used to sign in.</p></div></div><Field label="Admin email" type="email" value={profile.email} onChange={(email) => setProfile({ ...profile, email })} /><div className="admin-divider" /><Field label="Current password" type="password" value={profile.currentPassword} onChange={(currentPassword) => setProfile({ ...profile, currentPassword })} hint="Confirm your current password to save changes." /><Field label="New password" type="password" value={profile.newPassword} onChange={(newPassword) => setProfile({ ...profile, newPassword })} hint="Use at least 8 characters. Leave blank to keep your current password." /><button className="admin-primary" disabled={busy}><Save size={16} />{busy ? 'Saving…' : 'Update profile'}</button></form> : <form id="site-form" className="admin-panel admin-form" onSubmit={saveSite}>{active === 'content' ? <><div className="admin-panel-title"><div className="admin-panel-icon"><Settings2 size={19} /></div><div><h2>Homepage copy and contact details</h2><p>Changes appear on the public site after you save.</p></div></div><Field label="Company name" value={site.siteName} onChange={(siteName) => setSite({ ...site, siteName })} /><Field label="Hero eyebrow" value={site.heroEyebrow} onChange={(heroEyebrow) => setSite({ ...site, heroEyebrow })} /><Field label="Hero headline" value={site.heroTitle} onChange={(heroTitle) => setSite({ ...site, heroTitle })} /><Field label="Hero subtitle" value={site.heroSubtitle} onChange={(heroSubtitle) => setSite({ ...site, heroSubtitle })} /><Field label="Hero description" multiline value={site.heroDescription} onChange={(heroDescription) => setSite({ ...site, heroDescription })} /><Field label="About heading" value={site.aboutTitle} onChange={(aboutTitle) => setSite({ ...site, aboutTitle })} /><Field label="About description" multiline value={site.aboutCopy} onChange={(aboutCopy) => setSite({ ...site, aboutCopy })} /><div className="admin-divider" /><h3>Contact details</h3><div className="admin-field-grid"><Field label="Phone" value={site.contactPhone} onChange={(contactPhone) => setSite({ ...site, contactPhone })} /><Field label="Email" type="email" value={site.contactEmail} onChange={(contactEmail) => setSite({ ...site, contactEmail })} /></div><Field label="Address" value={site.contactAddress} onChange={(contactAddress) => setSite({ ...site, contactAddress })} /><div className="admin-divider" /><div className="admin-panel-title"><div className="admin-panel-icon"><Settings2 size={19} /></div><div><h2>Services</h2><p>Edit the service titles and descriptions shown on your homepage.</p></div></div>{site.services?.map((service, index) => <div className="admin-service-edit" key={index}><span>0{index + 1}</span><Field label="Service title" value={service.title} onChange={(title) => setSite({ ...site, services: site.services.map((item, i) => i === index ? { ...item, title } : item) })} /><Field label="Description" multiline value={service.copy} onChange={(copy) => setSite({ ...site, services: site.services.map((item, i) => i === index ? { ...item, copy } : item) })} /></div>)}<div className="admin-divider" /><div className="admin-panel-title"><div className="admin-panel-icon"><Image size={19} /></div><div><h2>Featured projects</h2><p>Edit each card title, detail, and View Project destination.</p></div></div>{site.projects?.map((project, index) => <div className="admin-project-edit" key={`edit-project-${index}`}><span>0{index + 1}</span><Field label="Project title" value={project.title} onChange={(title) => setSite({ ...site, projects: site.projects.map((item, i) => i === index ? { ...item, title } : item) })} /><Field label="Project details" value={project.detail} onChange={(detail) => setSite({ ...site, projects: site.projects.map((item, i) => i === index ? { ...item, detail } : item) })} /><Field label="View Project link" value={project.href} onChange={(href) => setSite({ ...site, projects: site.projects.map((item, i) => i === index ? { ...item, href } : item) })} /></div>)}</> : <><div className="admin-panel-title"><div className="admin-panel-icon"><Image size={19} /></div><div><h2>Website images</h2><p>Paste a public image URL to change the homepage imagery.</p></div></div>{[['heroImage','Hero background'],['aboutImage','About section image'],['projectImage','Projects background'],['contactImage','Contact background']].map(([key,label]) => <div className="admin-image-row" key={key}><div className="admin-image-preview" style={{ backgroundImage: `url("${site[key]}")` }} /><div className="admin-upload-controls"><Field label={label} hint="You can also paste a public image URL." value={site[key]} onChange={(value) => setSite({ ...site, [key]: value })} /><label className="admin-upload-button">{uploading === key ? 'Uploading…' : 'Choose image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={Boolean(uploading)} onChange={(event) => handleImageUpload(key, event.target.files?.[0])} /></label></div></div>)}<div className="admin-divider" /><h3>Featured project photos</h3>{site.projects?.map((project, index) => <div className="admin-image-row" key={`project-${index}`}><div className="admin-image-preview" style={{ backgroundImage: `url("${project.photo}")` }} /><div className="admin-upload-controls"><b className="admin-image-label">{project.title}</b><label className="admin-upload-button">{uploading === `project-${index}` ? 'Uploading…' : 'Upload project photo'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={Boolean(uploading)} onChange={(event) => handleImageUpload(`project-${index}`, event.target.files?.[0])} /></label></div></div>)}</> }<div className="admin-form-actions"><button className="admin-primary" disabled={busy || Boolean(uploading)}><Save size={16} />{busy ? 'Saving…' : 'Save changes'}</button></div></form>}
    </div></main></div>
}

export default Admin

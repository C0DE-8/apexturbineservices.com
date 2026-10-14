const http = require('node:http')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const mysql = require('mysql2/promise')
const multer = require('multer')

for (const line of (fs.existsSync(path.join(__dirname, '.env')) ? fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/) : [])) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
}

const PORT = Number(process.env.PORT || 3001)
const SESSION_MS = 12 * 60 * 60 * 1000
const sessions = new Map()
const databaseName = process.env.DB_NAME || 'apex_turbine_cms'
const publicApiUrl = (process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3002}`).replace(/\/$/, '')
const allowedOrigins = new Set((process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || 'http://localhost:5173,https://www.apexturbineservices.com,https://apexturbineservices.com').split(',').map((origin) => origin.trim()).filter(Boolean))
const pool = mysql.createPool({ host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: databaseName, waitForConnections: true, connectionLimit: 10, charset: 'utf8mb4' })
const uploadDirectory = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })
const upload = multer({ storage: multer.diskStorage({ destination: uploadDirectory, filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) })
const defaults = {
  siteName: 'Apex Turbine Services',
  heroEyebrow: 'Industrial Engineering • Power Generation • Global Reach',
  heroTitle: 'Powering Industry Through Precision Engineering',
  heroSubtitle: 'Gas Turbine Installation. Power Generation Solutions. Industrial Excellence.',
  heroDescription: 'We provide gas turbine installation, system integration, commissioning, and technical support for power generation facilities and industrial operations.',
  aboutTitle: 'Your Partner in Turbine Installation and Power Generation',
  aboutCopy: 'Apex Turbine Services is an industrial engineering company specializing in gas turbine installation, generator integration, commissioning and technical support for power plants and industrial facilities. We help our clients achieve reliable, efficient and safe power generation through expert engineering, skilled teams and a commitment to excellence.',
  contactPhone: '+1 (256) 288-7649', contactEmail: 'apexturbineservices@gmail.com', contactAddress: 'Huntsville, AL 35801, USA',
  heroImage: '/uploads/hero.jpg', aboutImage: '/uploads/about.jpg', projectImage: '/uploads/projects.jpg', contactImage: '/uploads/contact.jpg',
  services: [
    { title: 'Gas Turbine Installation', copy: 'Installation of industrial gas turbine equipment, including mechanical, electrical and auxiliary systems.' },
    { title: 'Turbine Commissioning', copy: 'System checks, startup preparation, operational testing and performance verification.' },
    { title: 'Generator Installation and Integration', copy: 'Integration of generators with turbines, electrical systems, protection equipment and controls.' },
    { title: 'Inspection & Maintenance', copy: 'Preventive maintenance, fault diagnosis and coordination of repairs.' },
    { title: 'Control Systems & Instrumentation', copy: 'Integration and testing of monitoring systems, alarms and turbine control equipment.' },
    { title: 'Industrial Power Plant Engineering', copy: 'Engineering coordination and technical support for new installations, upgrades and power projects.' },
  ],
  projects: [
    { photo: '/uploads/work-1.jpg', title: 'Industrial Gas Turbine Installation', detail: 'Power Generation  |  USA', href: '#contact' },
    { photo: '/uploads/work-2.jpg', title: 'Turbine Installation Team', detail: 'Power Generation  |  USA', href: '#contact' },
    { photo: '/uploads/work-3.jpg', title: 'Generator Integration Project', detail: 'Manufacturing  |  USA', href: '#contact' },
    { photo: '/uploads/work-4.jpg', title: 'Turbine Commissioning', detail: 'Oil & Gas  |  Middle East', href: '#contact' },
  ],
}

async function getSite(client = pool) {
  const [result] = await client.execute('SELECT content FROM site_settings WHERE id = 1')
  if (!result.length) return defaults
  const [services] = await client.execute('SELECT title, copy FROM services ORDER BY position ASC')
  const [projects] = await client.execute('SELECT photo, title, detail, href FROM projects ORDER BY position ASC')
  const storedContent = result[0].content
  const decodedContent = typeof storedContent === 'string' ? JSON.parse(storedContent) : storedContent
  const site = { ...defaults, ...(decodedContent || {}), services: services.length ? services : defaults.services, projects: projects.length ? projects : defaults.projects }
  for (const field of ['heroImage', 'aboutImage', 'projectImage', 'contactImage']) if (site[field]?.startsWith('/uploads/')) site[field] = `${publicApiUrl}${site[field]}`
  site.projects = site.projects.map((project) => ({ ...project, photo: project.photo?.startsWith('/uploads/') ? `${publicApiUrl}${project.photo}` : project.photo }))
  return site
}
async function getAdmin() {
  const [result] = await pool.execute('SELECT email, password_salt, password_hash FROM admin_accounts WHERE id = 1')
  return result[0] || null
}
async function initializeDatabase() {
  await pool.execute('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)')
  for (const migration of ['001_initial_cms_schema', '002_projects_and_original_media', '003_project_links', '004_relative_upload_paths']) {
    const [rows] = await pool.execute('SELECT version FROM schema_migrations WHERE version = ?', [migration])
    if (rows.length) continue
    const migrationSql = fs.readFileSync(path.join(__dirname, 'migrations', `${migration}.sql`), 'utf8')
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      if (migration === '003_project_links') {
        const [columns] = await connection.execute("SHOW COLUMNS FROM projects LIKE 'href'")
        if (!columns.length) await connection.query(migrationSql)
      } else await connection.query(migrationSql)
      if (migration === '002_projects_and_original_media') {
        const [content] = await connection.execute('SELECT content FROM site_settings WHERE id = 1')
        if (content[0]) {
          const site = typeof content[0].content === 'string' ? JSON.parse(content[0].content) : content[0].content
          for (const [field, value] of Object.entries({ heroImage: defaults.heroImage, aboutImage: defaults.aboutImage, projectImage: defaults.projectImage, contactImage: defaults.contactImage })) {
            if (site[field] === '/apex-logo.png') site[field] = value
          }
          if (!site.contactImage) site.contactImage = defaults.contactImage
          await connection.execute('UPDATE site_settings SET content = ? WHERE id = 1', [JSON.stringify(site)])
        }
        for (const [position, project] of defaults.projects.entries()) await connection.execute('INSERT INTO projects (position, photo, title, detail, href) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE position = position', [position, project.photo, project.title, project.detail, project.href])
      }
      await connection.execute('INSERT INTO schema_migrations (version) VALUES (?)', [migration])
      await connection.commit()
    } catch (error) { await connection.rollback(); throw error } finally { connection.release() }
  }
}

function send(res, status, body, extra = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...res.corsHeaders, ...extra })
  res.end(JSON.stringify(body))
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk; if (body.length > 1024 * 1024) reject(new Error('Request too large')) })
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')) } catch { reject(new Error('Invalid JSON')) } })
    req.on('error', reject)
  })
}
function currentSession(req) {
  const token = (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith('apex_admin='))?.slice('apex_admin='.length)
  const session = token && sessions.get(token)
  if (!session || session.expires < Date.now()) { if (token) sessions.delete(token); return null }
  return { token, session }
}
const server = http.createServer(async (req, res) => {
  const requestOrigin = req.headers.origin
  res.corsHeaders = requestOrigin && allowedOrigins.has(requestOrigin) ? { 'Access-Control-Allow-Origin': requestOrigin, 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS', 'Vary': 'Origin' } : {}
  if (req.method === 'OPTIONS') { res.writeHead(204, res.corsHeaders); return res.end() }
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  if (req.method === 'GET' && url.pathname.startsWith('/uploads/')) {
    const filename = path.basename(decodeURIComponent(url.pathname.slice('/uploads/'.length)))
    if (!filename) return send(res, 404, { error: 'Image not found.' })
    const filePath = path.join(uploadDirectory, filename)
    if (!fs.existsSync(filePath)) return send(res, 404, { error: 'Image not found.' })
    res.writeHead(200, { 'Content-Type': ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' })[path.extname(filename).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' })
    return fs.createReadStream(filePath).pipe(res)
  }
  if (req.method === 'POST' && url.pathname === '/api/admin/upload') {
    if (!currentSession(req)) return send(res, 401, { error: 'Please sign in again.' })
    return upload.single('image')(req, res, (error) => {
      if (error) return send(res, 400, { error: error.code === 'LIMIT_FILE_SIZE' ? 'Images must be 8 MB or smaller.' : error.message || 'Image upload failed.' })
      if (!req.file) return send(res, 400, { error: 'Choose a JPG, PNG, WebP, or GIF image.' })
      return send(res, 201, { url: `${publicApiUrl}/uploads/${req.file.filename}` })
    })
  }
  try {
    if (req.method === 'GET' && url.pathname === '/api/site') return send(res, 200, await getSite())
    if (req.method === 'GET' && url.pathname === '/api/admin/session') { const active = currentSession(req); const admin = active ? await getAdmin() : null; return send(res, 200, { authenticated: Boolean(active), admin: admin ? { email: admin.email } : null }) }
    if (req.method === 'POST' && url.pathname === '/api/admin/login') {
      const { email, password } = await readBody(req)
      const admin = await getAdmin()
      if (!admin) return send(res, 500, { error: 'Admin account has not been initialized.' })
      const candidate = crypto.scryptSync(String(password || ''), admin.password_salt, 64)
      const expected = Buffer.from(admin.password_hash, 'hex')
      if (String(email || '').toLowerCase() !== admin.email.toLowerCase() || candidate.length !== expected.length || !crypto.timingSafeEqual(candidate, expected)) return send(res, 401, { error: 'Email or password is incorrect.' })
      const token = crypto.randomBytes(32).toString('hex')
      sessions.set(token, { expires: Date.now() + SESSION_MS })
      return send(res, 200, { admin: { email: admin.email } }, { 'Set-Cookie': `apex_admin=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MS / 1000}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}` })
    }
    if (req.method === 'POST' && url.pathname === '/api/admin/logout') {
      const active = currentSession(req); if (active) sessions.delete(active.token)
      return send(res, 200, { ok: true }, { 'Set-Cookie': 'apex_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' })
    }
    if (req.method === 'PUT' && url.pathname === '/api/admin/site') {
      if (!currentSession(req)) return send(res, 401, { error: 'Please sign in again.' })
      const input = await readBody(req)
      const current = await getSite()
      const next = { ...current }
      for (const key of Object.keys(defaults)) {
        if (key === 'services' || key === 'projects') continue
        if (typeof input[key] === 'string') next[key] = input[key].replace(publicApiUrl, '').slice(0, 5000)
      }
      if (Array.isArray(input.services)) next.services = input.services.slice(0, 12).map((service) => ({ title: String(service.title || '').slice(0, 120), copy: String(service.copy || '').slice(0, 500) }))
      if (Array.isArray(input.projects)) next.projects = input.projects.slice(0, 4).map((project) => ({ photo: String(project.photo || '').replace(publicApiUrl, '').slice(0, 1000), title: String(project.title || '').slice(0, 120), detail: String(project.detail || '').slice(0, 250), href: String(project.href || '#contact').slice(0, 1000) }))
      const client = await pool.connect()
      try {
        await client.beginTransaction()
        const site = { ...next }; delete site.services
        await client.execute('UPDATE site_settings SET content = ?, updated_at = NOW() WHERE id = 1', [JSON.stringify(site)])
        await client.execute('DELETE FROM services')
        for (const [position, service] of next.services.entries()) await client.execute('INSERT INTO services (position, title, copy) VALUES (?, ?, ?)', [position, service.title, service.copy])
        await client.execute('DELETE FROM projects')
        for (const [position, project] of next.projects.entries()) await client.execute('INSERT INTO projects (position, photo, title, detail, href) VALUES (?, ?, ?, ?, ?)', [position, project.photo, project.title, project.detail, project.href])
        await client.commit()
      } catch (error) { await client.rollback(); throw error } finally { client.release() }
      return send(res, 200, { site: await getSite() })
    }
    if (req.method === 'PUT' && url.pathname === '/api/admin/profile') {
      if (!currentSession(req)) return send(res, 401, { error: 'Please sign in again.' })
      const { email, currentPassword, newPassword } = await readBody(req)
      const admin = await getAdmin()
      const currentHash = crypto.scryptSync(String(currentPassword || ''), admin.password_salt, 64)
      const expected = Buffer.from(admin.password_hash, 'hex')
      if (currentHash.length !== expected.length || !crypto.timingSafeEqual(currentHash, expected)) return send(res, 403, { error: 'Current password is incorrect.' })
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'Enter a valid email address.' })
      if (newPassword && String(newPassword).length < 8) return send(res, 400, { error: 'New password must have at least 8 characters.' })
      const nextEmail = email ? String(email).toLowerCase() : admin.email
      const salt = newPassword ? crypto.randomBytes(16).toString('hex') : admin.password_salt
      const hash = newPassword ? crypto.scryptSync(String(newPassword), salt, 64).toString('hex') : admin.password_hash
      await pool.execute('UPDATE admin_accounts SET email = ?, password_salt = ?, password_hash = ?, updated_at = NOW() WHERE id = 1', [nextEmail, salt, hash])
      return send(res, 200, { admin: { email: nextEmail } })
    }
    return send(res, 404, { error: 'Not found.' })
  } catch (error) {
    return send(res, error.message === 'Request too large' ? 413 : 400, { error: error.message || 'Request failed.' })
  }
})
initializeDatabase().then(() => server.listen(PORT, () => console.log(`Apex admin API connected to MySQL database "${databaseName}" on http://localhost:${PORT}`))).catch((error) => { console.error(`Could not connect to MySQL database "${databaseName}". Start MySQL in XAMPP and verify backend/.env:`, error.message); process.exit(1) })

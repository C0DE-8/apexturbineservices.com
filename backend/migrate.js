const fs = require('node:fs')
const path = require('node:path')
const mysql = require('mysql2/promise')

const connectionOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'apex_turbine_cms',
  multipleStatements: true,
}
const migrationNames = ['001_initial_cms_schema', '002_projects_and_original_media', '003_project_links', '004_relative_upload_paths']

async function migrate() {
  const connection = await mysql.createConnection({ ...connectionOptions, database: undefined })
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${connectionOptions.database.replaceAll('`', '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await connection.changeUser({ database: connectionOptions.database })
  await connection.query('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)')
  try {
    for (const migrationName of migrationNames) {
      const [rows] = await connection.execute('SELECT version FROM schema_migrations WHERE version = ?', [migrationName])
      if (rows.length) { console.log(`${migrationName} is already applied.`); continue }
      await connection.beginTransaction()
      if (migrationName === '001_initial_cms_schema') {
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', `${migrationName}.sql`), 'utf8')
        await connection.query(sql)
      } else if (migrationName === '002_projects_and_original_media') {
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', `${migrationName}.sql`), 'utf8')
        await connection.query(sql)
        const [content] = await connection.execute('SELECT content FROM site_settings WHERE id = 1')
        if (content[0]) {
          const saved = typeof content[0].content === 'string' ? JSON.parse(content[0].content) : content[0].content
          for (const [key, value] of Object.entries({ heroImage: '/uploads/hero.jpg', aboutImage: '/uploads/about.jpg', projectImage: '/uploads/projects.jpg', contactImage: '/uploads/contact.jpg' })) if (!saved[key] || saved[key] === '/apex-logo.png') saved[key] = value
          await connection.execute('UPDATE site_settings SET content = ? WHERE id = 1', [JSON.stringify(saved)])
        }
        const defaults = [
          ['/uploads/work-1.jpg', 'Industrial Gas Turbine Installation', 'Power Generation  |  USA', '#contact'],
          ['/uploads/work-2.jpg', 'Turbine Installation Team', 'Power Generation  |  USA', '#contact'],
          ['/uploads/work-3.jpg', 'Generator Integration Project', 'Manufacturing  |  USA', '#contact'],
          ['/uploads/work-4.jpg', 'Turbine Commissioning', 'Oil & Gas  |  Middle East', '#contact'],
        ]
        for (const [position, photo, title, detail, href] of defaults.map((row, index) => [index, ...row])) await connection.execute('INSERT INTO projects (position, photo, title, detail, href) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE position = position', [position, photo, title, detail, href])
      } else if (migrationName === '003_project_links') {
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', `${migrationName}.sql`), 'utf8')
        const [columns] = await connection.execute("SHOW COLUMNS FROM projects LIKE 'href'")
        if (!columns.length) await connection.query(sql)
      } else {
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', `${migrationName}.sql`), 'utf8')
        await connection.query(sql)
      }
      if (migrationName === '001_initial_cms_schema') {
        const salt = require('node:crypto').randomBytes(16).toString('hex')
        const password = process.env.ADMIN_PASSWORD || '123456'
        const hash = require('node:crypto').scryptSync(password, salt, 64).toString('hex')
        await connection.execute('INSERT INTO admin_accounts (id, email, password_salt, password_hash) VALUES (1, ?, ?, ?) ON DUPLICATE KEY UPDATE id = id', [process.env.ADMIN_EMAIL || 'admin@admin.com', salt, hash])
        const site = {
      siteName: 'Apex Turbine Services',
      heroEyebrow: 'Industrial Engineering • Power Generation • Global Reach',
      heroTitle: 'Powering Industry Through Precision Engineering',
      heroSubtitle: 'Gas Turbine Installation. Power Generation Solutions. Industrial Excellence.',
      heroDescription: 'We provide gas turbine installation, system integration, commissioning, and technical support for power generation facilities and industrial operations.',
      aboutTitle: 'Your Partner in Turbine Installation and Power Generation',
      aboutCopy: 'Apex Turbine Services is an industrial engineering company specializing in gas turbine installation, generator integration, commissioning and technical support for power plants and industrial facilities. We help our clients achieve reliable, efficient and safe power generation through expert engineering, skilled teams and a commitment to excellence.',
      contactPhone: '+1 (256) 288-7649', contactEmail: 'apexturbineservices@gmail.com', contactAddress: 'Huntsville, AL 35801, USA',
          heroImage: 'http://localhost:3002/uploads/hero.jpg', aboutImage: 'http://localhost:3002/uploads/about.jpg', projectImage: 'http://localhost:3002/uploads/projects.jpg', contactImage: 'http://localhost:3002/uploads/contact.jpg',
        }
        await connection.execute('INSERT INTO site_settings (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE id = id', [JSON.stringify(site)])
        const services = [
      ['Gas Turbine Installation', 'Installation of industrial gas turbine equipment, including mechanical, electrical and auxiliary systems.'],
      ['Turbine Commissioning', 'System checks, startup preparation, operational testing and performance verification.'],
      ['Generator Installation and Integration', 'Integration of generators with turbines, electrical systems, protection equipment and controls.'],
      ['Inspection & Maintenance', 'Preventive maintenance, fault diagnosis and coordination of repairs.'],
      ['Control Systems & Instrumentation', 'Integration and testing of monitoring systems, alarms and turbine control equipment.'],
      ['Industrial Power Plant Engineering', 'Engineering coordination and technical support for new installations, upgrades and power projects.'],
        ]
        for (const [position, title, copy] of services.map((row, i) => [i, ...row])) await connection.execute('INSERT INTO services (position, title, copy) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE position = position', [position, title, copy])
      }
      await connection.execute('INSERT INTO schema_migrations (version) VALUES (?)', [migrationName])
      await connection.commit()
      console.log(`Applied ${migrationName} to ${connectionOptions.database}.`)
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    await connection.end()
  }
}

migrate().catch((error) => {
  console.error('Migration failed. Check that MySQL/MariaDB is running and DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME are correct.', error.message)
  process.exitCode = 1
})

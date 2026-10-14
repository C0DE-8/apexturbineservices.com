UPDATE site_settings SET content = JSON_SET(content,
  '$.heroImage', REPLACE(JSON_UNQUOTE(JSON_EXTRACT(content, '$.heroImage')), 'http://localhost:3002', ''),
  '$.aboutImage', REPLACE(JSON_UNQUOTE(JSON_EXTRACT(content, '$.aboutImage')), 'http://localhost:3002', ''),
  '$.projectImage', REPLACE(JSON_UNQUOTE(JSON_EXTRACT(content, '$.projectImage')), 'http://localhost:3002', ''),
  '$.contactImage', REPLACE(JSON_UNQUOTE(JSON_EXTRACT(content, '$.contactImage')), 'http://localhost:3002', '')
) WHERE id = 1;
UPDATE projects SET photo = REPLACE(photo, 'http://localhost:3002', '') WHERE photo LIKE 'http://localhost:3002/uploads/%';

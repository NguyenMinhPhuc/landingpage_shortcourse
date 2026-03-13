/*
  SQL Server schema to store a content model for a landing page.
  - pages: top-level pages
  - sections: logical sections inside main (hero, modules, contact, ...)
  - articles: repeatable content blocks inside sections
  - components: atomic elements inside articles (title, paragraph, list, image, button)
  - nav_items: site nav entries
  - media: uploaded images/files

  This uses NVARCHAR and NVARCHAR(MAX) for content and JSON stored as text for props.
  Run in your SQL Server (example DB name: Training).
*/

-- Create schema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'cms')
  EXEC('CREATE SCHEMA cms');

-- Pages
CREATE TABLE cms.pages (
  id INT IDENTITY PRIMARY KEY,
  slug NVARCHAR(200) NOT NULL UNIQUE,
  title NVARCHAR(500) NULL,
  meta NVARCHAR(MAX) NULL,
  created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Sections (header, hero, modules, footer, ...)
CREATE TABLE cms.sections (
  id INT IDENTITY PRIMARY KEY,
  page_id INT NOT NULL REFERENCES cms.pages(id) ON DELETE CASCADE,
  key_name NVARCHAR(200) NULL, -- e.g. hero, pain-points, modules
  title NVARCHAR(500) NULL,
  [order] INT DEFAULT 0,
  settings NVARCHAR(MAX) NULL, -- JSON for layout/styling
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Articles (repeatable blocks inside sections)
CREATE TABLE cms.articles (
  id INT IDENTITY PRIMARY KEY,
  section_id INT NOT NULL REFERENCES cms.sections(id) ON DELETE CASCADE,
  key_name NVARCHAR(200) NULL, -- e.g. course-card-<id>
  title NVARCHAR(500) NULL,
  [order] INT DEFAULT 0,
  settings NVARCHAR(MAX) NULL, -- JSON
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Components are atomic pieces inside an article: heading, paragraph, list, image, button, etc.
CREATE TABLE cms.components (
  id INT IDENTITY PRIMARY KEY,
  article_id INT NOT NULL REFERENCES cms.articles(id) ON DELETE CASCADE,
  type NVARCHAR(50) NOT NULL, -- 'heading','paragraph','list','image','button','meta'
  content NVARCHAR(MAX) NULL, -- textual content
  props NVARCHAR(MAX) NULL, -- JSON for extra props (e.g. href, class, alt, items as JSON[])
  [order] INT DEFAULT 0,
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Navigation items
CREATE TABLE cms.nav_items (
  id INT IDENTITY PRIMARY KEY,
  page_id INT NULL REFERENCES cms.pages(id) ON DELETE SET NULL,
  label NVARCHAR(200) NOT NULL,
  href NVARCHAR(500) NULL,
  [order] INT DEFAULT 0
);

-- Media table
CREATE TABLE cms.media (
  id INT IDENTITY PRIMARY KEY,
  file_name NVARCHAR(500) NOT NULL,
  url NVARCHAR(2000) NOT NULL,
  mime_type NVARCHAR(200) NULL,
  size BIGINT NULL,
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Optional: courses table (structured data) referenced from articles/components
CREATE TABLE cms.courses (
  id INT IDENTITY PRIMARY KEY,
  slug NVARCHAR(200) UNIQUE,
  title NVARCHAR(500),
  short_desc NVARCHAR(1000),
  content NVARCHAR(MAX),
  duration NVARCHAR(100),
  audience NVARCHAR(500),
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Indexes to improve common lookups
CREATE INDEX IX_sections_page ON cms.sections(page_id);
CREATE INDEX IX_articles_section ON cms.articles(section_id);
CREATE INDEX IX_components_article ON cms.components(article_id);

/*
  Sample seed data based on current index.html
*/
-- Insert a page
INSERT INTO cms.pages (slug, title, meta) VALUES ('landing-shortcourse', 'Landing Shortcourse', NULL);
DECLARE @pageId INT = SCOPE_IDENTITY();

-- Insert sections (hero, pain-points, modules, instructor, contact, footer)
INSERT INTO cms.sections (page_id, key_name, title, [order]) VALUES
(@pageId, 'hero', 'Hero', 10),
(@pageId, 'pain-points', 'Pain Points', 20),
(@pageId, 'modules', 'Modules', 30),
(@pageId, 'instructor', 'Instructor', 40),
(@pageId, 'contact', 'Contact', 50),
(@pageId, 'footer', 'Footer', 60);

-- Grab inserted section ids
DECLARE @heroId INT = (SELECT id FROM cms.sections WHERE page_id = @pageId AND key_name = 'hero');
DECLARE @modulesId INT = (SELECT id FROM cms.sections WHERE page_id = @pageId AND key_name = 'modules');

-- Insert an article inside hero (main heading, paragraph, CTA)
INSERT INTO cms.articles (section_id, key_name, title, [order]) VALUES
(@heroId, 'hero-main', 'Hero Main', 1);
DECLARE @heroArticle INT = SCOPE_IDENTITY();

INSERT INTO cms.components (article_id, type, content, [order]) VALUES
(@heroArticle, 'heading', N'GIẢI PHÁP ĐÀO TẠO KỸ NĂNG SỐ & TRÍ TUỆ NHÂN TẠO THỰC CHIẾN', 10),
(@heroArticle, 'paragraph', N'Nâng cấp hiệu suất làm việc của đội ngũ lên 300% với các khóa học ngắn hạn thiết kế riêng. Tự động hóa báo cáo, làm chủ dữ liệu và ứng dụng AI ngay vào công việc hàng ngày.', 20),
(@heroArticle, 'button', N'Nhận Tư Vấn Lộ Trình Miễn Phí', 30);

-- Insert a modules article for a course card example
INSERT INTO cms.articles (section_id, key_name, title, [order]) VALUES
(@modulesId, 'course-data-1', 'Tối ưu Báo cáo Nhanh', 1);
DECLARE @courseArticle INT = SCOPE_IDENTITY();

INSERT INTO cms.components (article_id, type, content, props, [order]) VALUES
(@courseArticle, 'heading', N'Tối ưu Báo cáo Nhanh', NULL, 10),
(@courseArticle, 'paragraph', N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.', NULL, 20),
(@courseArticle, 'list', NULL, N'{ "items": ["Buổi 1: Pivot Table & hàm nâng cao","Buổi 2: Tối ưu template báo cáo"] }', 30),
(@courseArticle, 'button', N'Xem chi tiết', N'{ "action": "open-modal", "target": "data-1" }', 40);

-- Add nav items
INSERT INTO cms.nav_items (page_id, label, href, [order]) VALUES
(@pageId, 'Điểm Nghẽn', '#pain-points', 10),
(@pageId, 'Chuyên Đề', '#modules', 20),
(@pageId, 'Giảng Viên', '#instructor', 30),
(@pageId, 'Liên Hệ', '#contact', 40);

-- Example media
INSERT INTO cms.media (file_name, url, mime_type) VALUES
('LHU_ASU_VI_Medium_Ngang.png', '/images/LHU_ASU_VI_Medium_Ngang.png', 'image/png');

/*
  End of schema + sample seeds.
  Next steps:
  - Run this script on your SQL Server (database: Training or chosen DB).
  - Extend components.props JSON structure to include classes/IDs or nested components.
  - Use the Next.js API to fetch rows and render on the site.
*/

/* Seed script to insert courses from courses.json into cms.courses
   Run in your SQL Server database where schema 'cms' exists.
*/

SET NOCOUNT ON;

-- Remove existing seeded slugs to avoid duplicates
DELETE FROM cms.courses WHERE slug IN (
  'data-1','data-2','data-3','data-4','ai-1','ai-2','sec-1','sec-2'
);

-- Insert records
INSERT INTO cms.courses (slug, title, short_desc, content, duration, audience)
VALUES
(N'data-1', N'Tối ưu Báo cáo Nhanh', N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.',
 N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.\nNội dung tóm tắt: Buổi 1: Pivot Table & hàm nâng cao; Buổi 2: Tối ưu template báo cáo\nĐối tượng: Nhân viên báo cáo, kế toán, quản lý\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Nhân viên báo cáo, kế toán, quản lý'),

(N'data-2', N'Nhập môn Power BI', N'Thiết kế Dashboard tương tác, hiểu mô hình dữ liệu và trình bày insight cho người quản lý.',
 N'Thiết kế Dashboard tương tác, hiểu mô hình dữ liệu và trình bày insight cho người quản lý.\nNội dung tóm tắt: Buổi 1: Mô hình & visual cơ bản; Buổi 2: Dashboard & storytelling\nĐối tượng: Người làm báo cáo, analyst\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Người làm báo cáo, analyst'),

(N'data-3', N'Tối ưu Báo cáo Nhanh', N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.',
 N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.\nNội dung tóm tắt: Buổi 1: Pivot Table & hàm nâng cao\nBuổi 2: Tối ưu template báo cáo\nĐối tượng: Nhân viên báo cáo, kế toán, quản lý\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Nhân viên báo cáo, kế toán, quản lý'),

(N'data-4', N'Tối ưu Báo cáo Nhanh test', N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.',
 N'Giúp nhân viên giảm thời gian tổng hợp báo cáo bằng kỹ thuật Excel nâng cao và tự động hóa.\nNội dung tóm tắt:\nBuổi 1: Pivot Table & hàm nâng cao\nBuổi 2: Tối ưu template báo cáo\nĐối tượng: Nhân viên báo cáo, kế toán, quản lý\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Nhân viên báo cáo, kế toán, quản lý'),

(N'ai-1', N'Prompt Engineering cho Văn Phòng', N'Kỹ thuật xây dựng prompt để AI hỗ trợ soạn thảo, tóm tắt và chỉnh sửa nội dung chuyên nghiệp.',
 N'Kỹ thuật xây dựng prompt để AI hỗ trợ soạn thảo, tóm tắt và chỉnh sửa nội dung chuyên nghiệp.\nNội dung tóm tắt: Buổi 1: Tư duy prompt & kỹ thuật; Buổi 2: Ứng dụng thực tế trên email, hợp đồng\nĐối tượng: Nhân viên văn phòng, người soạn thảo nội dung\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Nhân viên văn phòng, người soạn thảo nội dung'),

(N'ai-2', N'AI trong Phân tích & Trình bày', N'Sử dụng AI để phân tích sơ bộ dữ liệu và tự động sinh slide, giảm thời gian chuẩn bị báo cáo.',
 N'Sử dụng AI để phân tích sơ bộ dữ liệu và tự động sinh slide, giảm thời gian chuẩn bị báo cáo.\nNội dung tóm tắt: Buổi 1: AI cho phân tích sơ bộ; Buổi 2: Tự động tạo slide & báo cáo\nĐối tượng: Analyst, trình bày, quản lý\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Analyst, trình bày, quản lý'),

(N'sec-1', N'Nhận thức An toàn Thông tin', N'Nâng cao nhận thức bảo mật: chống lừa đảo, bảo vệ dữ liệu và quy trình xử lý sự cố.',
 N'Nâng cao nhận thức bảo mật: chống lừa đảo, bảo vệ dữ liệu và quy trình xử lý sự cố.\nNội dung tóm tắt: Buổi 1: Nguyên tắc an toàn; Buổi 2: Kịch bản xử lý sự cố\nĐối tượng: Toàn bộ nhân viên\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Toàn bộ nhân viên'),

(N'sec-2', N'Tự động hóa Không dùng Code', N'Thiết kế quy trình phê duyệt nội bộ tự động (Power Automate / Zapier) mà không cần code.',
 N'Thiết kế quy trình phê duyệt nội bộ tự động (Power Automate / Zapier) mà không cần code.\nNội dung tóm tắt: Buổi 1: Công cụ No-Code; Buổi 2: Thiết kế & triển khai quy trình\nĐối tượng: Nhân viên vận hành, quản lý quy trình\nThời lượng: 2 buổi (6 giờ)',
 N'2 buổi (6 giờ)', N'Nhân viên vận hành, quản lý quy trình');

PRINT 'Seed complete.';

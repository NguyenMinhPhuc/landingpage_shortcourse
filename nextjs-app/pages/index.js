import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

function Header() {
  return (
    <header style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
      <div style={{ fontWeight: 700 }}>Company / Shortcourse</div>
      <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
        <a href="#modules">Modules</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Modal({ open, onClose, course }) {
  if (!open || !course) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ width: 720, maxWidth: '95%', background: '#fff', padding: 20 }} onClick={e => e.stopPropagation()}>
        <h3>{course.title}</h3>
        <p>{course.description || course.desc}</p>
        <ul>
          {(course.meta || []).map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCourse, setModalCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('data');
  const sliderRefs = useRef({});

  useEffect(() => {
    // load page model
    fetch('/api/admin/page')
      .then(r => r.json())
      .then(j => {
        if (j && j.data && j.data.pages && j.data.pages['landing-shortcourse']) setPage(j.data.pages['landing-shortcourse']);
      })
      .catch(() => { });
    // load courses (SQL via API with fallback)
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => { if (d && d.data) setCourses(d.data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const getCourseKey = (c) => (c?.slug ?? c?.id ?? c?.ID ?? '').toString();
  const getShortDesc = (c) => c?.short_desc ?? c?.description ?? c?.desc ?? '';
  const openCourse = (key) => {
    const k = (key ?? '').toString();
    const c = courses.find(x => getCourseKey(x) === k);
    if (c) setModalCourse(c);
  };

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setModalCourse(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const slide = (tabKey, dir) => {
    const el = sliderRefs.current[tabKey];
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  if (loading && !page) return <div style={{ padding: 24 }}>Loading...</div>;

  const modulesSection = page ? page.sections.find(s => s.key_name === 'modules') : null;

  // helpers for tab filtering
  const tabPrefix = { data: 'data-', ai: 'ai-', security: 'sec-' };

  // compute lists for tabs (fallback to all courses if prefixed subsets are empty)
  const dataList = courses.filter(c => getCourseKey(c).startsWith(tabPrefix['data']));
  const dataUse = dataList.length ? dataList : courses;
  const aiList = courses.filter(c => getCourseKey(c).startsWith(tabPrefix['ai']));
  const aiUse = aiList.length ? aiList : courses;
  const secList = courses.filter(c => getCourseKey(c).startsWith(tabPrefix['security']));
  const securityUse = secList.length ? secList : courses;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#0b2545' }}>
      <Head>
        <link rel="stylesheet" href="/css/style.css" />
        <title>{(page && page.title) || 'Landing Shortcourse'}</title>
      </Head>

      {/* Nav from original site */}
      <nav className="site-nav">
        <div className="container nav-inner">
          <div className="brand">
            <img src="/images/LHU_ASU_VI_Medium_Ngang.png" alt="Brand" />
            <div className="brand-text">
              <span className="univ">Đại học Lạc Hồng</span>
              <span className="dept">Khoa Công nghệ thông tin</span>
            </div>
          </div>
          <div className="nav-links">
            <a href="#pain-points">Điểm Nghẽn</a>
            <a href="#modules">Chuyên Đề</a>
            <a href="#instructor">Giảng Viên</a>
            <a href="#contact">Liên Hệ</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero">
        <div className="container">
          {page && (() => {
            const hero = page.sections.find(s => s.key_name === 'hero');
            if (!hero) return null;
            const art = hero.articles[0];
            const heading = art.components.find(c => c.type === 'heading');
            const paragraph = art.components.find(c => c.type === 'paragraph');
            const cta = art.components.find(c => c.type === 'button');
            return (
              <>
                <h1>{heading?.content}</h1>
                <p>{paragraph?.content}</p>
                {cta && <a href={cta.props?.href || '#contact'} className="btn">{cta.content}</a>}
              </>
            );
          })()}
        </div>
      </section>

      {/* Pain points */}
      <section id="pain-points" className="container">
        <h2 style={{ textAlign: 'center' }}>Đội Ngũ Của Bạn Có Đang Gặp Phải Những "Điểm Nghẽn" Này?</h2>
        <div className="pain-points">
          {page && page.sections.find(s => s.key_name === 'pain-points') && page.sections.find(s => s.key_name === 'pain-points').articles.map(a => (
            <div key={a.id} className="pain-card">
              <h3>{a.title}</h3>
              {a.components && a.components[0] && <p>{a.components[0].content}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Modules / Tabs */}
      <section id="modules">
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Các Chuyên Đề Đào Tạo Ngắn Hạn (Short-Courses)</h2>
          <p style={{ textAlign: 'center', marginBottom: 30 }}>Học thật - Làm thật. Mỗi chuyên đề gói gọn trong 2 buổi (6 giờ), kết hợp 30% tư duy và 70% thực hành trực tiếp trên bài toán của doanh nghiệp.</p>

          <div className="tabs">
            <button className={"tab-btn" + (activeTab === 'data' ? ' active' : '')} onClick={() => setActiveTab('data')}>Dữ liệu & Báo cáo</button>
            <button className={"tab-btn" + (activeTab === 'ai' ? ' active' : '')} onClick={() => setActiveTab('ai')}>AI Ứng dụng</button>
            <button className={"tab-btn" + (activeTab === 'security' ? ' active' : '')} onClick={() => setActiveTab('security')}>Tự động hóa & Bảo mật</button>
          </div>

          <div id="data" className={"tab-content" + (activeTab === 'data' ? ' active' : '')}>
            <div className="course-slider">
              <button className="slide-btn prev" aria-label="Previous" onClick={() => slide('data', -1)}>‹</button>
              <div className="course-cards" ref={el => sliderRefs.current['data'] = el}>
                {dataUse.map((c, i) => (
                  <article key={getCourseKey(c) || i} className={"course-card accent-" + ((i % 3) + 1)} data-course-id={getCourseKey(c)}>
                    <h4 className="course-title">{c.title}</h4>
                    <p className="course-desc">{getShortDesc(c)}</p>
                    <ul className="course-meta">
                      {c.duration ? <li>Thời lượng: {String(c.duration).replace(/^\s*Thời lượng\s*[:：]\s*/i, '')}</li> : null}
                      {c.audience ? <li>Đối tượng: {String(c.audience).replace(/^\s*Đối tượng\s*[:：]\s*/i, '')}</li> : null}
                    </ul>
                    <button className="btn btn-outline" onClick={() => openCourse(getCourseKey(c))}>Xem chi tiết</button>
                  </article>
                ))}
              </div>
              <button className="slide-btn next" aria-label="Next" onClick={() => slide('data', 1)}>›</button>
            </div>
          </div>

          <div id="ai" className={"tab-content" + (activeTab === 'ai' ? ' active' : '')}>
            <div className="course-slider">
              <button className="slide-btn prev" aria-label="Previous" onClick={() => slide('ai', -1)}>‹</button>
              <div className="course-cards" ref={el => sliderRefs.current['ai'] = el}>
                {aiUse.map((c, i) => (
                  <article key={getCourseKey(c) || i} className={"course-card accent-" + ((i % 3) + 1)} data-course-id={getCourseKey(c)}>
                    <h4 className="course-title">{c.title}</h4>
                    <p className="course-desc">{getShortDesc(c)}</p>
                    <ul className="course-meta">
                      {c.duration ? <li>Thời lượng: {String(c.duration).replace(/^\s*Thời lượng\s*[:：]\s*/i, '')}</li> : null}
                      {c.audience ? <li>Đối tượng: {String(c.audience).replace(/^\s*Đối tượng\s*[:：]\s*/i, '')}</li> : null}
                    </ul>
                    <button className="btn btn-outline" onClick={() => openCourse(getCourseKey(c))}>Xem chi tiết</button>
                  </article>
                ))}
              </div>
              <button className="slide-btn next" aria-label="Next" onClick={() => slide('ai', 1)}>›</button>
            </div>
          </div>

          <div id="security" className={"tab-content" + (activeTab === 'security' ? ' active' : '')}>
            <div className="course-slider">
              <button className="slide-btn prev" aria-label="Previous" onClick={() => slide('security', -1)}>‹</button>
              <div className="course-cards" ref={el => sliderRefs.current['security'] = el}>
                {securityUse.map((c, i) => (
                  <article key={getCourseKey(c) || i} className={"course-card accent-" + ((i % 3) + 1)} data-course-id={getCourseKey(c)}>
                    <h4 className="course-title">{c.title}</h4>
                    <p className="course-desc">{getShortDesc(c)}</p>
                    <ul className="course-meta">
                      {c.duration ? <li>Thời lượng: {String(c.duration).replace(/^\s*Thời lượng\s*[:：]\s*/i, '')}</li> : null}
                      {c.audience ? <li>Đối tượng: {String(c.audience).replace(/^\s*Đối tượng\s*[:：]\s*/i, '')}</li> : null}
                    </ul>
                    <button className="btn btn-outline" onClick={() => openCourse(getCourseKey(c))}>Xem chi tiết</button>
                  </article>
                ))}
              </div>
              <button className="slide-btn next" aria-label="Next" onClick={() => slide('security', 1)}>›</button>
            </div>
          </div>

        </div>
      </section>

      {/* Instructor and contact - reuse pageData if present */}
      <section id="instructor">
        <div className="container profile-wrap">
          <div className="profile-text">
            {page && page.sections.find(s => s.key_name === 'instructor') && (
              <>
                <h2>Sự Khác Biệt Trong Phương Pháp Đào Tạo</h2>
                <h3>Giảng viên: ThS. Nguyễn Minh Phúc</h3>
                <p><strong>Khoa Công nghệ Thông tin, Đại học Lạc Hồng</strong></p>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="container">
        <h2>Đầu Tư Nâng Cấp Đội Ngũ Ngay Hôm Nay!</h2>
        <p style={{ marginBottom: 30 }}>Để lại thông tin, chúng tôi sẽ liên hệ trong vòng 24h để tư vấn và thiết kế lộ trình đào tạo phù hợp nhất cho doanh nghiệp của bạn.</p>
        <form id="leadForm">
          <div className="form-group">
            <label>Họ và Tên người liên hệ *</label>
            <input type="text" placeholder="Nhập họ và tên" />
          </div>
          <div className="form-group">
            <label>Tên Doanh nghiệp *</label>
            <input type="text" placeholder="Nhập tên công ty" />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" placeholder="Nhập số điện thoại" />
          </div>
          <div className="form-group">
            <label>Mối quan tâm chính</label>
            <select>
              <option value="ai">Khóa học AI Văn phòng</option>
              <option value="data">Phân tích Dữ liệu & Power BI</option>
              <option value="security">Bảo mật & Tự động hóa</option>
              <option value="combo">Combo Lộ trình Toàn diện</option>
            </select>
          </div>
          <button type="button" className="btn" style={{ width: '100%' }}>Yêu Cầu Báo Giá & Nhận Profile</button>
        </form>
      </section>

      <footer>
        <p style={{ fontSize: '0.8rem', marginTop: 5 }}>&copy; {new Date().getFullYear()} Giải Pháp Đào Tạo Số Doanh Nghiệp. Tối ưu hóa hiệu suất - Kiến tạo tương lai.</p>
        <p style={{ fontSize: '0.8rem', marginTop: 5 }}>Khoa Công nghệ Thông tin - Đại học Lạc Hồng</p>
      </footer>

      {/* Course Detail Modal (uses same classes as original CSS) */}
      <div id="courseModal" className="modal" aria-hidden={modalCourse ? 'false' : 'true'}>
        <div className="modal-backdrop" onClick={() => setModalCourse(null)}></div>
        <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="courseModalTitle">
          <button className="modal-close" aria-label="Close" onClick={() => setModalCourse(null)}>×</button>
          <h3 id="courseModalTitle">{modalCourse?.title}</h3>
          <p id="courseModalDesc">{String(modalCourse?.content || '').replace(/\\n/g, '\n') || getShortDesc(modalCourse)}</p>
          <ul id="courseModalMeta" className="course-meta">
            {modalCourse?.duration ? <li>Thời lượng: {String(modalCourse.duration).replace(/^\s*Thời lượng\s*[:：]\s*/i, '')}</li> : null}
            {modalCourse?.audience ? <li>Đối tượng: {String(modalCourse.audience).replace(/^\s*Đối tượng\s*[:：]\s*/i, '')}</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

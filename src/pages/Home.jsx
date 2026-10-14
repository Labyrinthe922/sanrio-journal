import {Link} from 'react-router-dom';
import {characters} from '../data/characters.js';
import {Visual} from '../components/Visual.jsx';

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">ISSUE 01 · A JOURNAL OF SMALL JOYS</span>
        <h1>A LITTLE WORLD<br/><em>OF HAPPINESS</em></h1>
        <div className="hero-description">
  <p>A journal of characters, memories &amp; little joys.</p>
  <p className="hero-description-zh">一个装满幸福的小小世界——记录角色、回忆与生活中的小小欢喜。</p>
</div>
        <div className="hero-actions">
          <Link className="button button-dark" to="/characters">探索角色 <span>↗</span></Link>
          <Link className="button button-outline" to="/planet">探索角色星球 <span>✦</span></Link>
        </div>
      </div>

      <div className="hero-art">
        <div className="hero-image-wrap">
          <img
            className="hero-image"
            src={`${import.meta.env.BASE_URL}images/home/sanrio-hero.png`}
            alt="Sanrio characters"
          />
        </div>
        <span className="hero-index">FIG. 01 — HAPPY THINGS</span>
      </div>

      <div className="hero-scroll">向下滚动，继续探索 ↓</div>
    </section>
  
    <section className="editor-section">
      <div className="editor-label">
        <div className="editor-label-title">
          <span className="eyebrow">EDITOR’S NOTES</span>
          <span className="home-section-zh">编辑手记</span>
        </div>
        <span>NOTE № 001</span>
      </div>
      <div className="editor-content">
        <h2>Small things.<br/><em>Big feelings.</em></h2>
        <p>角色不只是一个可爱的形象，也可以是心情的书签。一个熟悉的表情或颜色，有时能替我们表达当下的感受，也让角色文化自然进入日常。</p>
        <Link className="text-button" to="/about">阅读角色文化手记 ↗</Link>
      </div>
      <div className="editor-doodle">✿</div>
    </section>

    <section className="section featured">
      <div className="section-heading">
        <div>
          <span className="eyebrow">A FEW FAMILIAR FACES</span>
          <h2>Featured characters</h2>
          <span className="home-section-zh">精选角色</span>
        </div>
        <Link className="text-button" to="/characters">查看全部角色 ↗</Link>
      </div>
      <div className="featured-grid">
        {characters.slice(0,4).map(c=>
          <Link className="featured-card" to={`/characters?open=${c.id}`} key={c.id}>
            <div className="featured-art">
              <Visual character={c}/>
            </div>
            <div className="featured-info">
              <span>{c.en}</span>
              <span>{c.zh} ↗</span>
            </div>
            <p>{c.short}</p>
          </Link>
        )}
      </div>
    </section>

    <section className="share-invitation">
      <div className="share-invitation-copy">
        <span className="eyebrow">YOUR STORY, YOUR LITTLE JOY</span>
        <h2>Share Your Story</h2>
        <span className="home-section-zh">分享你的故事</span>
        <p className="share-invitation-lead">每一份喜欢，都值得被记录。</p>
        <p>分享你与三丽鸥角色之间的小故事，让那些温暖的瞬间被更多人看见。</p>
        <Link className="button button-dark" to="/share">
          分享我的故事 <span>↗</span>
        </Link>
      </div>
      <span className="share-invitation-decoration" aria-hidden="true">♡</span>
    </section>

    <section className="official-strip">
      <div>
        <span className="eyebrow">A WINDOW TO THE ORIGINAL WORLD</span>
        <h2>Official resources</h2>
        <span className="home-section-zh">官方资料</span>
        <p>想了解更多角色信息，请访问三丽鸥官方页面。</p>
      </div>
      <div className="official-links">
        <a href="https://www.sanrio.co.jp/characters/" target="_blank" rel="noreferrer">三丽鸥官方角色目录 <span>↗</span></a>
        <a href="https://www.sanrio.com/" target="_blank" rel="noreferrer">三丽鸥英文官网 <span>↗</span></a>
        <a href="https://www.sanrio.co.jp/movies/youtube-sanrio/?pager=1" target="_blank" rel="noreferrer">三丽鸥官方视频内容 <span>↗</span></a>
      </div>
    </section>
  </>;
}

import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/session'
import './Login.css';
import { CgMusicNote } from "react-icons/cg";
import { ArrowRight, CirclePlay, LayoutTemplate, Link2, Music4, Sparkles } from 'lucide-react';

const featurePoints = [
  {
    icon: <Music4 size={18} />,
    title: 'Audio-first by design',
    body: 'Let people hear your work quickly instead of digging through scattered links and attachments.'
  },
  {
    icon: <LayoutTemplate size={18} />,
    title: 'Tailored pitch cards',
    body: 'Build different cards for different genres, buyers, and opportunities without rebuilding your whole site.'
  },
  {
    icon: <Link2 size={18} />,
    title: 'One clean link',
    body: 'Tracks, bio, visuals, contact info, and credits packaged into one polished presentation.'
  }
]

const workflowSteps = [
  'Upload tracks and build a focused playlist',
  'Customize the card to match the style of the pitch',
  'Preview it, publish it, and send one link when it matters'
]

const pricingOptions = [
  'Create drafts for free',
  '$19 for one live pitch card',
  '$39 for a 3-card pack',
  'Optional setup help for faster launches'
]

const faqs = [
  {
    question: 'Is ScoreSync a full portfolio builder?',
    answer: 'Not really. It is more focused than that. ScoreSync is built around the moment you need to send your work clearly, quickly, and professionally.'
  },
  {
    question: 'Who is it best for right now?',
    answer: 'Composers, producers, and music professionals pitching for film, TV, games, trailers, ads, or other media work.'
  },
  {
    question: 'How does pricing work?',
    answer: 'The model we are validating is simple: create for free, then pay once when you are ready to publish a live card.'
  }
]

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login({ credential, password }))
      if (res.ok) navigate('/dashboard')
    } catch (error) {
      const err = await error.json()
      setErrorMessage(err.errors)
    }
  };

  const handleLoginDemoUser = () => {
    dispatch(login({ credential:'nicoborro', password:'password'})).then(()=> navigate('/dashboard'))
  }

  return (
    <div className='landing-page'>
      <header className='landing-topbar'>
        <a className='landing-brand' href='#top'>
          <span className='landing-brand-icon'><CgMusicNote size={28} /></span>
          <span>SCORESYNC</span>
        </a>

        <nav className='landing-nav'>
          <a href='#product'>Product</a>
          <a href='#workflow'>How it works</a>
          <a href='#pricing'>Pricing</a>
          <a href='#sign-in'>Sign in</a>
        </nav>

        <div className='landing-topbar-actions'>
          <a className='ghost-link' href='#sign-in'>Sign in</a>
          <a className='primary-link-button' href='/signup'>Join the beta</a>
        </div>
      </header>

      <main id='top'>
        <section className='hero-section'>
          <div className='hero-copy'>
            <span className='hero-eyebrow'>For composers, musicians, and audio professionals</span>
            <h1>Your music deserves a better first impression.</h1>
            <p className='hero-subheadline'>
              ScoreSync helps you create polished, playable pitch cards you can actually afford to use —
              free to create, pay once when you are ready to publish.
            </p>

            <div className='hero-cta-row'>
              <a className='primary-hero-button' href='/signup'>Create for free <ArrowRight size={18} /></a>
              <a className='secondary-hero-button' href='#workflow'><CirclePlay size={18} /> See how it works</a>
            </div>

            <div className='hero-proof-pills'>
              <span>One clean link</span>
              <span>Audio-first showcase</span>
              <span>No monthly subscription required</span>
            </div>

            <div className='hero-feature-grid'>
              {featurePoints.map((point) => (
                <article key={point.title} className='hero-feature-card'>
                  <div className='hero-feature-icon'>{point.icon}</div>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className='hero-visual-column'>
            <div className='hero-showcase-card'>
              <div className='hero-showcase-stack'>
                <img className='hero-card hero-card-back' src='/landing/bf-card.jpg' alt='ScoreSync composer card example' />
                <img className='hero-card hero-card-front' src='/landing/ae-card.jpg' alt='ScoreSync A&E composer pitch card' />
                <img className='hero-card hero-card-accent' src='/landing/published-card.jpg' alt='Published ScoreSync card preview' />
              </div>
            </div>

            <aside className='signin-panel' id='sign-in'>
              <div className='signin-panel-heading'>
                <span className='signin-badge'><Sparkles size={14} /> Existing user</span>
                <h2>Sign in to your workspace</h2>
                <p>Already building cards? Pick up where you left off.</p>
              </div>

              <form onSubmit={handleSubmit} className='signin-form'>
                <div className='input-group'>
                  <label htmlFor='credential'>
                    <input
                      placeholder='Username or email address'
                      id='credential'
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      required
                      autoComplete='username'
                    />
                  </label>
                </div>
                <div className='input-group'>
                  <label htmlFor='password'>
                    <input
                      type='password'
                      id='password'
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete='current-password'
                    />
                  </label>
                  {errorMessage?.credential && <p className='error-message'>{errorMessage.credential}</p>}
                </div>
                <button type='submit' className='login-button'>Continue</button>
              </form>

              <div className='signin-links'>
                <a href='/signup'>Create an account</a>
                <button type='button' className='demo-link-button' onClick={handleLoginDemoUser}>Use demo account</button>
              </div>
            </aside>
          </div>
        </section>

        <section className='landing-section narrative-section' id='product'>
          <div className='section-heading'>
            <span className='section-kicker'>The pitch problem</span>
            <h2>Stop sending a PDF, a Dropbox link, a bio, and a prayer.</h2>
            <p>
              Most musicians still present themselves like it is 2012. ScoreSync gives you one polished,
              audio-first page that feels intentional, professional, and easy to share.
            </p>
          </div>

          <div className='narrative-showcase'>
            <div className='showcase-copy-card'>
              <h3>Designed for the moment you need to get hired</h3>
              <ul className='workflow-list'>
                {workflowSteps.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
            <div className='showcase-image-card waveform-card'>
              <img src='/landing/catalog-waveform.jpg' alt='ScoreSync catalog view with playable waveform track' />
            </div>
          </div>
        </section>

        <section className='landing-section workflow-section' id='workflow'>
          <div className='section-heading narrow'>
            <span className='section-kicker'>How it works</span>
            <h2>Clean enough for a landing page. Practical enough for real pitching.</h2>
            <p>
              The magic is not more pages. It is having the right card, with the right tracks,
              looking sharp when you need to send it.
            </p>
          </div>

          <div className='workflow-grid'>
            <div className='motion-card'>
              <video autoPlay muted loop playsInline controls poster='/landing/color-tool.jpg'>
                <source src='/landing/drag-drop-demo.mp4' type='video/mp4' />
              </video>
            </div>
            <div className='workflow-side-stack'>
              <article className='supporting-shot-card'>
                <img src='/landing/color-tool.jpg' alt='ScoreSync customization interface' />
                <div>
                  <h3>Style the card to match the pitch</h3>
                  <p>Dial in the colors, typography, imagery, and tone instead of sending one generic profile forever.</p>
                </div>
              </article>
              <article className='supporting-shot-card'>
                <img src='/landing/published-card.jpg' alt='Published ScoreSync card example' />
                <div>
                  <h3>Preview and publish fast</h3>
                  <p>Get to a polished public card without needing a full portfolio rebuild or another subscription tool.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className='landing-section pricing-section' id='pricing'>
          <div className='section-heading'>
            <span className='section-kicker'>Pricing model</span>
            <h2>Built for talented musicians, not enterprise budgets.</h2>
            <p>
              ScoreSync is built around a DIY, pay-when-ready model that fits how musicians actually pitch.
            </p>
          </div>

          <div className='pricing-grid'>
            <div className='pricing-card featured'>
              <span className='pricing-label'>Current direction</span>
              <h3>Create your card for free. Pay once when you are ready to publish.</h3>
              <ul>
                {pricingOptions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div className='pricing-card beta-card'>
              <span className='pricing-label'>Founding beta</span>
              <h3>Join early and help shape the product.</h3>
              <p>We are opening ScoreSync to a small group of users who want a better way to present their work.</p>
              <div className='beta-actions'>
                <a className='primary-link-button full' href='/signup'>Join the beta</a>
                <a className='ghost-link emphasize' href='#sign-in'>Already have an account?</a>
              </div>
            </div>
          </div>
        </section>

        <section className='landing-section faq-section'>
          <div className='section-heading narrow'>
            <span className='section-kicker'>FAQ</span>
            <h2>What people will want to know first.</h2>
          </div>
          <div className='faq-grid'>
            {faqs.map((faq) => (
              <article key={faq.question} className='faq-card'>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;

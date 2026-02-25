/* ==========================================================================
   Lite YouTube Embed
   Lazy-loads YouTube iframes on click for fast page loads.
   Usage: <lite-youtube videoid="VIDEO_ID"></lite-youtube>
   ========================================================================== */

class LiteYTEmbed extends HTMLElement {
  connectedCallback() {
    const videoId = this.getAttribute('videoid');
    if (!videoId) return;

    this.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-label', 'Predvajaj video');

    // Play button
    const playBtn = document.createElement('div');
    playBtn.classList.add('lyt-playbtn');
    this.append(playBtn);

    const activate = () => {
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.title = 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      this.innerHTML = '';
      this.append(iframe);
      this.classList.add('lyt-activated');
    };

    this.addEventListener('click', activate, { once: true });
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') activate();
    }, { once: true });
  }
}

customElements.define('lite-youtube', LiteYTEmbed);

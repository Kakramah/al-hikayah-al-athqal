/**
 * الحكاية الأثقل · تفاعل وتمرير سلس وموجة أثير حية وكاشف الثنائية
 * وفق ميزان خلدون عكرمة وقواعد الويب 5.11
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 1. شريط القراءة وشريط التنقل العلوي
  const progressBar = document.querySelector('.reading-progress-bar');
  const siteNav = document.querySelector('.site-nav');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (!prefersReducedMotion.matches && progressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${scrollPercent})`;
    }

    if (siteNav) {
      if (scrollTop > 60) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 2. كانفاس موجة الأثير التفاعلية في شاشة الهيرو
  const waveCanvas = document.getElementById('hero-wave-canvas');
  if (waveCanvas && !prefersReducedMotion.matches) {
    const ctx = waveCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let time = 0;
    let mouseInfluence = 0.5;

    function resizeCanvas() {
      width = waveCanvas.width = waveCanvas.offsetWidth;
      height = waveCanvas.height = waveCanvas.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      const normalizedY = e.clientY / window.innerHeight;
      mouseInfluence = 0.3 + normalizedY * 0.7;
    }, { passive: true });

    function drawWave() {
      if (window.scrollY > window.innerHeight) {
        animationFrameId = requestAnimationFrame(drawWave);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const centerY = height * 0.72;
      const wavesCount = 3;

      for (let i = 0; i < wavesCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1.2;
        
        // ألوان ذهبية كهرمانية ناعمة بتدرج شفاف
        if (i === 0) {
          ctx.strokeStyle = 'rgba(201, 165, 87, 0.45)';
        } else if (i === 1) {
          ctx.strokeStyle = 'rgba(223, 188, 109, 0.28)';
        } else {
          ctx.strokeStyle = 'rgba(201, 165, 87, 0.15)';
        }

        const step = 8;
        const speed = 0.02 + i * 0.008;
        const waveLength = 0.006 - i * 0.0012;
        const amplitude = (24 + i * 16) * mouseInfluence;

        for (let x = 0; x <= width; x += step) {
          const y = centerY + Math.sin(x * waveLength + time * speed + i) * amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      time += 1;
      animationFrameId = requestAnimationFrame(drawWave);
    }

    drawWave();
  }

  // 3. السرد الغامر بالتمرير (Scrollytelling Stages)
  const stepCards = document.querySelectorAll('.step-card');
  const stageLayers = document.querySelectorAll('.stage-layer');

  if ('IntersectionObserver' in window && stepCards.length > 0) {
    const scrollyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = entry.target.getAttribute('data-step');
          
          stepCards.forEach((card) => card.classList.remove('active'));
          entry.target.classList.add('active');

          stageLayers.forEach((layer) => {
            if (layer.getAttribute('data-layer') === stepIndex) {
              layer.classList.add('active');
            } else {
              layer.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2
    });

    stepCards.forEach((card) => scrollyObserver.observe(card));
  }

  // 4. كاشف الثنائية التفاعلي (Split Lens Slider)
  const splitContainer = document.querySelector('.split-slider-container');
  const splitLayerStudio = document.querySelector('.split-view-layer.layer-studio');
  const splitHandle = document.querySelector('.split-handle');

  if (splitContainer && splitLayerStudio && splitHandle) {
    let isDragging = false;

    function setSplitPosition(clientX) {
      const rect = splitContainer.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;

      if (percent < 5) percent = 5;
      if (percent > 95) percent = 95;

      splitLayerStudio.style.width = `${percent}%`;
      splitHandle.style.left = `${percent}%`;
    }

    splitContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSplitPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSplitPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // دعم اللمس على الهاتف
    splitContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        setSplitPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0) return;
      setSplitPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // دعم الأسهم بلوحة المفاتيح
    splitHandle.setAttribute('tabindex', '0');
    splitHandle.setAttribute('role', 'slider');
    splitHandle.setAttribute('aria-label', 'مقبض كاشف الثنائية');
    splitHandle.setAttribute('aria-valuenow', '50');

    splitHandle.addEventListener('keydown', (e) => {
      let currentVal = parseFloat(splitLayerStudio.style.width) || 50;
      if (e.key === 'ArrowRight') {
        currentVal = Math.min(95, currentVal + 5);
      } else if (e.key === 'ArrowLeft') {
        currentVal = Math.max(5, currentVal - 5);
      } else {
        return;
      }
      splitLayerStudio.style.width = `${currentVal}%`;
      splitHandle.style.left = `${currentVal}%`;
      splitHandle.setAttribute('aria-valuenow', currentVal.toString());
    });
  }

  // 5. الخريطة التفاعلية للمسارين (الخارج والداخل)
  const mapTabButtons = document.querySelectorAll('.map-tab-btn');
  const mapSvgAbroad = document.getElementById('map-group-abroad');
  const mapSvgInside = document.getElementById('map-group-inside');
  const mapPanelTitle = document.getElementById('map-panel-title');
  const mapPanelText = document.getElementById('map-panel-text');
  const mapPanelQuote = document.getElementById('map-panel-quote');

  const mapData = {
    abroad: {
      title: 'عواصم الشتات ومقاعد البث',
      text: 'ناشطون كتبوا المقالات والمنشورات، وشاركوا في الاعتصامات أمام السفارات في عواصم العالم، وحملوا الثورة بصوتهم من الخارج، لكنهم يعلمون أن تجربتهم تختصر في أسطر معدودة ولا تقارن بمن دفع الثمن في الميدان.',
      quote: 'ماذا سيقول ناشط ثوري أمضى ثمانين بالمئة من سنوات الثورة خارج سوريا؟ كتب المقالات والمنشورات، وشارك في الاعتصامات أمام السفارات وفي عواصم العالم..'
    },
    inside: {
      title: 'خنادق الصمت في الداخل السوري',
      text: 'مقاتلون مغمورون عاشوا الثورة في خنادقها وواجهوا الموت في تفاصيله اليومية. لا تصنع منهم الخوارزميات نجوماً ولا تبحث عنهم المنصات لأنهم لا يجلبون إعلانات ولا مشاهدات صاخبة، لكن حكايتهم هي الأثقل والأبقى.',
      quote: 'وربما كان الأجدر بهذه المنصات أن تبحث عن مقاتل مغمور، لم يسمع به كثيرون، ولم تصنع منه الخوارزميات نجماً، لكنه عاش الثورة في خنادقها، وواجه الموت في تفاصيلها اليومية..'
    }
  };

  mapTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      mapTabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (target === 'abroad') {
        if (mapSvgAbroad) mapSvgAbroad.style.display = 'inline';
        if (mapSvgInside) mapSvgInside.style.display = 'none';
        if (mapPanelTitle) mapPanelTitle.textContent = mapData.abroad.title;
        if (mapPanelText) mapPanelText.textContent = mapData.abroad.text;
        if (mapPanelQuote) mapPanelQuote.textContent = mapData.abroad.quote;
      } else {
        if (mapSvgAbroad) mapSvgAbroad.style.display = 'none';
        if (mapSvgInside) mapSvgInside.style.display = 'inline';
        if (mapPanelTitle) mapPanelTitle.textContent = mapData.inside.title;
        if (mapPanelText) mapPanelText.textContent = mapData.inside.text;
        if (mapPanelQuote) mapPanelQuote.textContent = mapData.inside.quote;
      }
    });
  });

  // 6. معرض الصور التفاعلي (Lightbox) مع التنقل بالأسهم
  const galleryImages = Array.from(document.querySelectorAll('img[data-title]'));
  const lightbox = document.getElementById('lightbox');
  let currentIndex = 0;

  if (lightbox && galleryImages.length > 0) {
    const lbImg = lightbox.querySelector('.lb-img');
    const lbTitle = lightbox.querySelector('.lb-title');
    const lbDesc = lightbox.querySelector('.lb-desc');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxContent();
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    function updateLightboxContent() {
      const img = galleryImages[currentIndex];
      if (lbImg) {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
      }
      if (lbTitle) lbTitle.textContent = img.getAttribute('data-title') || '';
      if (lbDesc) lbDesc.textContent = img.getAttribute('data-desc') || '';
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxContent();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightboxContent();
    }

    galleryImages.forEach((img, idx) => {
      img.addEventListener('click', () => openLightbox(idx));
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', showPrev);
    if (lbNext) lbNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showPrev();
      if (e.key === 'ArrowLeft') showNext();
    });
  }

  // 7. درج المصادر والمراجع (مغلق افتراضياً)
  const sourcesToggle = document.querySelector('.sources-toggle');
  const sourcesDrawer = document.querySelector('.sources-drawer');

  if (sourcesToggle && sourcesDrawer) {
    sourcesToggle.addEventListener('click', () => {
      const isExpanded = sourcesToggle.getAttribute('aria-expanded') === 'true';
      sourcesToggle.setAttribute('aria-expanded', !isExpanded);
      sourcesDrawer.classList.toggle('open');
    });
  }

  // 8. زر المشاركة
  const shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareUrl = window.location.href;
      const shareTitle = document.title;

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            url: shareUrl
          });
        } catch (err) {
          // تم الإلغاء
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareUrl);
          const originalText = shareBtn.textContent;
          shareBtn.textContent = 'تم نسخ رابط التحقيق';
          setTimeout(() => {
            shareBtn.textContent = originalText;
          }, 3000);
        } catch (err) {
          // خطأ نسخ
        }
      }
    });
  }

  // 9. نموذج التواصل (Web3Forms)
  const contactForm = document.querySelector('.footer-form');
  const feedbackMsg = document.querySelector('.form-feedback');
  let lastSubmitTime = 0;

  if (contactForm && feedbackMsg) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastSubmitTime < 30000) {
        feedbackMsg.textContent = 'يرجى الانتظار نصف دقيقة قبل إرسال رسالة جديدة.';
        feedbackMsg.className = 'form-feedback success-message error';
        return;
      }

      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const formData = new FormData(contactForm);

      if (submitBtn) submitBtn.disabled = true;
      feedbackMsg.textContent = 'جاري إرسال رسالتك..';
      feedbackMsg.className = 'form-feedback success-message';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
          lastSubmitTime = Date.now();
          feedbackMsg.textContent = 'وصلت رسالتك باحترام وتقدير.';
          feedbackMsg.className = 'form-feedback success-message success';
          contactForm.reset();
        } else {
          feedbackMsg.textContent = 'تعذّر الإرسال حالياً، يمكنك المراسلة عبر البريد أو واتساب مباشرة.';
          feedbackMsg.className = 'form-feedback success-message error';
        }
      } catch (error) {
        feedbackMsg.textContent = 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.';
        feedbackMsg.className = 'form-feedback success-message error';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});

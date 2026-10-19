const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? '✕' : '☰';
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = '☰';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
form?.addEventListener('submit', e => {
  e.preventDefault();
  // Replace the placeholder below with Athr Agency's real WhatsApp number.
  const whatsappNumber = '201119780803';
  if (whatsappNumber.includes('X')) {
    toast.textContent = 'قبل النشر: افتح script.js واستبدل 20XXXXXXXXXX برقم واتساب الوكالة بكود مصر 20 بدون + أو مسافات.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 6500);
    return;
  }
  const data = new FormData(form);
  const message = `أهلًا Athr Agency، اسمي ${data.get('name')}.\nالخدمة المطلوبة: ${data.get('service')}.\nتفاصيل المشروع: ${data.get('message') || 'حابب أعرف تفاصيل أكتر.'}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

/* ===== ATHR PROJECT GALLERIES ===== */
(() => {
  const galleries = {
    food: {
      title: "حملات المطاعم والمنتجات",
      images: [
        "burger-campaign-00000.jpg",
        "burger-campaign-0000.jpg",
        "burger-campaign-000.jpg",
        "burger-campaign-00.jpg",
        "burger-campaign-01.jpg",
        "burger-campaign-06.jpg",
        "burger-campaign-07.jpg",
        "burger-campaign-08.jpg",
        "burger-campaign-09.jpg",
        "burger-campaign-12.jpg",
        "burger-campaign-13.jpg"
      ]
    },
medical: {
  title: "تصميمات طبية",
  images: [
    "Abo-campaign-01.jpg",
    "Abo-campaign-02.jpg",
    "Gawish-campaign-01.jpg",
    "Gawish-campaign-02.jpg",
    "Gawish-campaign-04.jpg",
    "Gawish-campaign-07.jpg",
    "Gawish-campaign-10.jpg"
      ]
    },
    print: {
      title: "ُإيفرست برنت",
      images: [
        "print-campaign-01.jpg",
        "print-campaign-02.jpg",
        "print-campaign-03.jpg",
        "print-campaign-04.jpg",
        "print-campaign-05.jpg",
        "print-campaign-06.jpg",
        "print-campaign-08.jpg"
      ]
    },
    tech: {
      title: "TechGen",
      images: [
        "Tech-campaign-01.jpg",
        "Tech-campaign-02.jpg",
        "Tech-campaign-03.jpg",
        "Tech-campaign-04.jpg",
        "Tech-campaign-05.jpg"
      ]
    }
  };

  const modal = document.getElementById("galleryModal");
  const image = document.getElementById("galleryImage");
  const title = document.getElementById("galleryTitle");
  const counter = document.getElementById("galleryCounter");
  const thumbnails = document.getElementById("galleryThumbnails");
  const previous = modal?.querySelector(".gallery-prev");
  const next = modal?.querySelector(".gallery-next");

  if (!modal || !image || !title || !counter || !thumbnails) return;

  let activeGallery = null;
  let activeIndex = 0;
  let previousFocus = null;

  function showImage(index) {
    if (!activeGallery) return;

    const list = activeGallery.images;
    activeIndex = (index + list.length) % list.length;

    image.src = "designs/" + list[activeIndex];
    image.alt = activeGallery.title + " - تصميم " + (activeIndex + 1);
    counter.textContent = (activeIndex + 1) + " / " + list.length;

    thumbnails.querySelectorAll(".gallery-thumb").forEach((thumb, i) => {
      const isActive = i === activeIndex;
      thumb.classList.toggle("is-active", isActive);

      if (isActive) {
        thumb.setAttribute("aria-current", "true");
        thumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        });
      } else {
        thumb.removeAttribute("aria-current");
      }
    });
  }

  function openGallery(key) {
    const gallery = galleries[key];
    if (!gallery) return;

    activeGallery = gallery;
    activeIndex = 0;
    previousFocus = document.activeElement;

    title.textContent = gallery.title;
    thumbnails.replaceChildren();

    gallery.images.forEach((filename, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-thumb";
      button.setAttribute("aria-label", "عرض التصميم " + (index + 1));

      const thumbImage = document.createElement("img");
      thumbImage.src = "designs/" + filename;
      thumbImage.alt = "";
      thumbImage.loading = "lazy";

      button.appendChild(thumbImage);
      button.addEventListener("click", () => showImage(index));
      thumbnails.appendChild(button);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    showImage(0);
    modal.querySelector(".gallery-close")?.focus();
  }

  function closeGallery() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    image.removeAttribute("src");
    activeGallery = null;

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  document.querySelectorAll("[data-gallery]").forEach(card => {
    card.addEventListener("click", () => {
      openGallery(card.dataset.gallery);
    });
  });

  previous?.addEventListener("click", () => {
    if (activeGallery) showImage(activeIndex - 1);
  });

  next?.addEventListener("click", () => {
    if (activeGallery) showImage(activeIndex + 1);
  });

  modal.querySelectorAll("[data-close-gallery]").forEach(element => {
    element.addEventListener("click", closeGallery);
  });

  document.addEventListener("keydown", event => {
    if (!activeGallery) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
  });
})();

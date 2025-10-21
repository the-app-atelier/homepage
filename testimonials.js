// Testimonial carousel data
  const testimonials = [
    {
      quote: "Herr Gogolos zeigte eine schnelle Auffassungsgabe und verfügt über umfangreiche Fachkenntnisse, die er zielgerichtet eingebracht hat. Er zeigte über den gesamten Zeitraum eine hohe Motivation und Eigeninitiative. Er führte seine Aufgaben jederzeit zügig aus und behielt auch unter hohem Zeitdruck die Übersicht und agierte stets ruhig und überlegt.",
      author: "Dr. Michael Rüther",
      title: "Geschäftsführer, Spherity GmbH",
      logo: "assets/logos/spherity_logo_gradient.png"
    },
    {
      quote: "Herr Gogolos verfügt über ein umfassendes und gutes Fachwissen, das er zur Bewältigung seiner Aufgaben sehr sicher und erfolgreich einsetzte. Er hat sich innerhalb kürzester Zeit in den ihm gestellten Aufgabenbereich eingearbeitet und verfolgte die vereinbarten Ziele nachhaltig und mit höchstem Erfolg.",
      author: "Christina Ratte",
      title: "Teamlead User Operation, Sharpist GmbH",
      logo: "assets/logos/sharpist_full.jpg"
    },
    {
      quote: "We quickly recognized Iosif to be someone who is constantly looking to develop himself further. To sum up, we would describe Iosif Gogolos as an ambitious, reflected and engaged individual who is eager to step up and learn continuously.",
      author: "Sara Ronzero",
      title: "Team Lead Content Experience, Sharpist GmbH",
      logo: "assets/logos/sharpist_full.jpg"
    },
    {
      quote: "Herr Gogolos besitzt eine gute Auffassungsgabe. Er arbeitete sich schnell und engagiert in die jeweilige Materie ein. Auf Grund seiner Affinitäten zum Marketing und seines Verständnisses für internationale Arbeitsprozesse konnte er zudem erfolgreich in den umfangreichen Aufgabengebieten unserer Marketingabteilung eingesetzt werden.",
      author: "Tim von der Decken",
      title: "Vice President, Efficio GmbH",
      logo: "assets/logos/efficio.png"
    },
    {
      quote: "Besonders hervorzuheben ist seine Urteilsfähigkeit, die ihn auch in schwierigen Lagen zu einem eigenständigen, ausgewogenen und zutreffenden Urteil befähigte. Herr Gogolos überblickte schwierige Zusammenhänge, erkannte das Wesentliche und war in der Lage durch neue Ideen schnell Lösungen aufzuzeigen.",
      author: "Wolfgang Wilmes",
      title: "HR Business Partner, Axel Springer National Media & Tech",
      logo: "assets/logos/axelspringer_logo_long_black-ink_srgb.png"
    },
    {
      quote: "Herr Gogolos verfügt über ein umfassendes und fundiertes Fachwissen, das er jederzeit gut in die Praxis umzusetzen wusste. Schwierige Aufgaben ging er mit Elan an und fand dabei sinnvolle und praktikable Lösungen.",
      author: "Carsten Wacker",
      title: "smart7 GmbH",
      logo: "assets/logos/s7black.png"
    }
  ];

  let currentTestimonialIndex = 0;
  const quoteElement = document.getElementById('active-quote');
  
  function updateTestimonial(index, skipAnimation = false) {
    if (skipAnimation) {
      showTestimonial(index);
      return;
    }

    // Fade out
    quoteElement.style.opacity = 0;
    
    // Wait for fade out to complete before changing
    setTimeout(() => {
      showTestimonial(index);
      
      // Fade in
      quoteElement.style.opacity = 1;
    }, 400);
  }

  function showTestimonial(index) {
    currentTestimonialIndex = index;
    const testimonial = testimonials[index];
    
    // Update quote text
    quoteElement.textContent = testimonial.quote;
    
    // Update author info
    document.querySelector('.author-name').textContent = testimonial.author;
    document.querySelector('.author-title').textContent = testimonial.title;
    document.querySelector('.company-logo').src = testimonial.logo;
    document.querySelector('.company-logo').alt = testimonial.title.split(',')[1] ? testimonial.title.split(',')[1].trim() + ' Logo' : testimonial.title + ' Logo';

    // Update pagination dots
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('testimonial-dot-active');
      } else {
        dot.classList.remove('testimonial-dot-active');
      }
    });
  }

  // Set initial state
  quoteElement.style.opacity = 1;
  quoteElement.style.transition = "opacity 0.4s ease-in-out";

  // Add event listeners for arrows
  document.querySelector('.testimonial-arrow-left').addEventListener('click', function() {
    let newIndex = currentTestimonialIndex - 1;
    if (newIndex < 0) newIndex = testimonials.length - 1;
    updateTestimonial(newIndex);
  });

  document.querySelector('.testimonial-arrow-right').addEventListener('click', function() {
    let newIndex = currentTestimonialIndex + 1;
    if (newIndex >= testimonials.length) newIndex = 0;
    updateTestimonial(newIndex);
  });

  // Add event listeners for pagination dots
  document.querySelectorAll('.testimonial-dot').forEach(dot => {
    dot.addEventListener('click', function() {
      updateTestimonial(parseInt(this.dataset.index));
    });
  });

  // Auto-rotate testimonials
  let autoRotateInterval;
  const AUTO_ROTATE_DELAY = 8000; // 8 seconds between rotations
  
  function startAutoRotate() {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
      let newIndex = currentTestimonialIndex + 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      updateTestimonial(newIndex);
    }, AUTO_ROTATE_DELAY);
  }

  // Start auto-rotation
  startAutoRotate();
  
  // Pause auto-rotation when interacting with the carousel
  document.querySelector('.testimonial-carousel').addEventListener('mouseenter', () => {
    clearInterval(autoRotateInterval);
  });
  
  document.querySelector('.testimonial-carousel').addEventListener('mouseleave', () => {
    startAutoRotate();
  });
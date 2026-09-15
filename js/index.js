let specificCss;
let typeCombo;
let langCombo;
let printBtn;
let portfolioChckbx;
let cvContainer;

let currentCv;

const cvDict = {
  "cool": {
    "html": "./src/cool-cv.html",
    "css": "./css/cool-cv.css"
  },
  "pro": {
    "html": "./src/pro-cv.html",
    "css": "./css/pro-cv.css"
  }
}

addEventListener("DOMContentLoaded", async _ => {
  specificCss = document.getElementById("specific-css");
  typeCombo = document.getElementById("type-combobox");
  langCombo = document.getElementById("lenguage-combobox");
  printBtn = document.getElementById("print-btn");
  portfolioChckbx = document.getElementById("portfolio-chckbx");
  cvContainer = document.getElementById("cv-container");

  currentCv = typeCombo.value;

  typeCombo.addEventListener("change", async (event) => {
    currentCv = event.target.value;
    await loadCv();
    await loadTranslationSheet(langCombo.value);
  });

  langCombo.addEventListener("change", (event) => {
    loadTranslationSheet(event.target.value);
  });

  printBtn.addEventListener("click", () => {
    window.print()
  });

  portfolioChckbx.addEventListener('change', function() {
    const display = this.checked ? "block" : "none";
    document.getElementById('portfolio-link').style.display = display;
  });

  await loadCv();
  await loadTranslationSheet(langCombo.value);
})

async function loadCv() {
  const data = cvDict[currentCv];

  specificCss.href = data.css;

  try {
    const res = await fetch(data.html)
    if (!res.ok) {
      throw new Error(`Error loading file: ${response.status}`);
    }

    cvContainer.innerHTML = await res.text();
  } catch (error) {
    console.error('Error loading CV content:', error);
    cvContainer.innerHTML = '<p>Error loading CV content.</p>';
  }
}

async function loadTranslationSheet(lang) {
  document.title = `CV ${(currentCv == 'cool' ? 'Tech' : 'Pro')} - Yago Pernas (${lang})`;

  try {
    const response = await fetch(`./translations/${lang}.json`)

    if (!response.ok) {
      throw new Error(`Error loading translation sheet for '${lang}': ${response.body} - ${response.status}`)
    }

    let translation = await response.json();
    change_lang(translation)
  } catch (error) {
    console.error(error)
  }
}

function change_lang(translation) {
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.getAttribute('data-lang-key');
    let translatedText = translation[key];
    if (!translatedText) return;

    if (element.hasAttribute('data-tag')) {
      element.setAttribute('data-tag', translatedText);
    } else {
      if (typeof currentCv !== 'undefined' && currentCv === 'pro' && translatedText.includes("■")) {
        translatedText = translatedText.replace("■", "").trimStart();
      }

      element.textContent = translatedText;
    }
  });
}

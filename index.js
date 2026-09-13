addEventListener("DOMContentLoaded", _ => {
  let langCombo = document.getElementById("lenguage-combobox");
  let printBtn = document.getElementById("print-btn");

  if (!langCombo || !printBtn) return;

  langCombo.addEventListener("change", (event) => {
    loadTranslationSheet(event.target.value);
  });

  printBtn.addEventListener("click", () => {
    alert("Selected lang: " + langCombo.value);
  });

  loadTranslationSheet(langCombo.value);
})

async function loadTranslationSheet(lang) {
  try {
    const response = await fetch(`./translations/${lang}.json`)

    if (!response.ok) {
      throw new Error(`Error loading translation sheet for '${lang}': ${response.body} - ${response.status}`)
    }

    let translation = await response.json();
    change_lang(translation)
  } catch (error) {
    alert(error)
    console.error(error)
  }
}

function change_lang(translation) {
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.getAttribute('data-lang-key');
    const translatedText = translation[key];
    if (!translatedText) return;

    if (element.hasAttribute('data-tag')) {
      element.setAttribute('data-tag', translation[key])
    } else {
      element.textContent = translation[key];
    }
  });
}

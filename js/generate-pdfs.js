import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { execSync } from 'child_process';

(async () => {
  const rootDir = path.join(import.meta.dirname, '..');
  const outputDir = path.join(rootDir, 'pdf');

  const gsPath = path.join(rootDir, 'bin', 'gswin64c.exe');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    args: ['--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  const fileUrl = pathToFileURL(path.resolve(rootDir, 'index.html')).href;

  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#type-combobox');

  const types = ['cool', 'pro'];
  const languages = ['es', 'en'];

  for (const type of types) {
    for (const lang of languages) {
      console.log(`Printing CV type '${type}' in lang '${lang}'`);

      await page.evaluate((t, l) => {
        const typeCombo = document.getElementById('type-combobox');
        const langCombo = document.getElementById('lenguage-combobox');

        typeCombo.value = t;
        typeCombo.dispatchEvent(new Event('change'));

        langCombo.value = l;
        langCombo.dispatchEvent(new Event('change'));
      }, type, lang);

      await new Promise(resolve => setTimeout(resolve, 500));

      const typeName = type === 'cool' ? 'Tech' : 'Pro';
      const fileName = `CV ${typeName} - Yago Pernas (${lang}).pdf`;
      const tempPath = path.join(outputDir, `temp_${fileName}`);
      const finalPath = path.join(outputDir, fileName);

      await page.pdf({
        path: tempPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
      });

      try {
        const gsCmd = `"${gsPath}" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${finalPath}" "${tempPath}"`;
        execSync(gsCmd);
        fs.unlinkSync(tempPath);
        console.log(`Saved & Compressed: pdf/${fileName}\n`);
      } catch (err) {
        console.error(`Compression failed, keeping uncompressed file:`, err.message);
        if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
        fs.renameSync(tempPath, finalPath);
      }
    }
  }

  await browser.close();
})();

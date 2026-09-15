@echo off
cd /d "%~dp0"
echo Creating PDFs...
echo ------------------------
node js\generate-pdfs.js

echo Opening output folder...
explorer "%~dp0pdf"

pause

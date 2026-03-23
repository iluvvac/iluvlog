export type PresetType = 'passport-passbook' | 'retro-newspaper' | 'OMR-exam-sheet' | 'rolls-film';

// Base64 Tekstur Kertas
const paperTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4EEoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURf///+Hh4ePj4+Xl5ebm5ufn5+jo6Onp6erq6urr6+vr6+/v7/Dx8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///wAAACH5BAEAAAD/LAAAAAAsAC4AAAAAnEiE5O7p5O7p6u3r7+3t7O7u7O7u6ejo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo1S5FpgAAAIlURBVDjL3dbfCYMwDADgyf5jB5m549H+m+8HhV4E6w5j0D9DkCYBfD0j4GMBfCsg4FMBfCwgwKcCKCggYAYCDhgIOGAg4ICBgAMGAg4YCDhgIOGAgYADBgaG49gYjsmR8ZiM44YcGSfGvLzN50Y+/V4vH79U0z9/m9/r7X0vXv//39mX64//R6z/Mv1r5iFvXo4v7x8S2zC9A6WbI40hH5I8AAAAAElFTkSuQmCC";

export const drawBackgroundPreset = (ctx: CanvasRenderingContext2D, preset: PresetType, w: number, h: number) => {
  ctx.save();
  const img = new Image();
  img.src = paperTexture;
  const paperPattern = ctx.createPattern(img, 'repeat');

  if (preset === 'passport-passbook') {
    ctx.fillStyle = '#E8DFCC';
    ctx.fillRect(0, 0, w, h);
    if(paperPattern) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = paperPattern;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = 'rgba(168, 56, 56, 0.4)';
    ctx.lineWidth = 1.5;
    for (let y = 120; y < h - 100; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.strokeStyle = '#4A463D';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, w - 40, 80);
    ctx.strokeRect(40, 40, 40, 40);
    ctx.fillStyle = '#4A463D';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('PASSPORT / BANKBOOK', 100, 50);
    ctx.fillRect(100, 60, 200, 1);
    ctx.fillText('A 45 66 12', w - 100, 50);
    ctx.strokeRect(40, h - 220, 180, 200);
    ctx.font = '10px monospace';
    ctx.fillText('PHOTO', 100, h - 120);
    for(let y = h - 190; y < h - 40; y += 30) ctx.fillRect(240, y, w - 280, 1);
    const grad = ctx.createRadialGradient(w/2, h/2, w*0.3, w/2, h/2, w*0.8);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(120, 90, 40, 0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

  } else if (preset === 'retro-newspaper') {
    ctx.fillStyle = '#CFC5B1'; 
    ctx.fillRect(0, 0, w, h);
    if(paperPattern) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = paperPattern;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, w - 72, h - 72);
    ctx.fillStyle = '#2A2A2A';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('DAILY CHRONICLE', w/2 - 100, 80);
    ctx.font = '12px monospace';
    ctx.fillText('VOL XC | LONDON | 1895 | PRICE ONE PENNY', w/2 - 120, 105);
    ctx.fillRect(36, 120, w - 72, 3);
    ctx.fillRect(36, 125, w - 72, 1);
    for(let x = 60; x < w - 60; x += 150) ctx.fillRect(x, 150, 1, h - 200);
    ctx.font = '10px monospace';
    for(let y = 160; y < h - 100; y += 12) {
        for(let x = 70; x < w - 70; x += 150) ctx.fillRect(x, y, 120, 1);
    }
    ctx.fillRect(36, h - 80, w - 72, 2);
    ctx.font = 'bold 16px monospace';
    ctx.fillText('CLASSIFIEDS', w/2 - 60, h - 55);
    ctx.fillStyle = 'rgba(107, 78, 35, 0.1)';
    ctx.fillRect(0, 0, w, h);

  } else if (preset === 'OMR-exam-sheet') {
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0F0F0F';
    for(let y = 120; y < h - 120; y += 10) {
      ctx.fillRect(30, y, 50, Math.random() > 0.5 ? 2 : 5);
    }
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 30, w - 130, 80);
    ctx.fillStyle = '#2A2A2A';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('SECTION II: OPTICAL MARK READING', 120, 60);
    ctx.font = '10px monospace';
    ctx.fillText('PART A: CHOOSE ONE CORRECT OPTION', 120, 85);
    ctx.fillRect(100, 110, w - 130, 1);
    ctx.strokeRect(w - 250, 40, 200, 60);
    ctx.font = '10px monospace';
    ctx.fillText('NAME:', w - 230, 60);
    ctx.fillText('DATE:', w - 230, 85);
    ctx.fillRect(w - 180, 65, 120, 1);
    ctx.fillRect(w - 180, 90, 120, 1);
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 1;
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#2A2A2A';
    for(let y = 160; y < h - 40; y += 35) {
        ctx.fillText(`${Math.floor((y - 160)/35) + 1}`, 110, y + 5);
        for(let x = 160; x < w - 60; x += 60) {
            ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
            if(Math.random() < 0.2) ctx.fill();
            const options = ['A', 'B', 'C', 'D'];
            ctx.fillText(options[(x - 160) / 60], x - 3, y + 4); 
        }
    }
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0.1)');
    grad.addColorStop(0.1, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

  } else if (preset === 'rolls-film') {
    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, 70);
    ctx.fillRect(0, h - 70, w, 70);
    ctx.fillStyle = '#F0F0F0';
    for(let x = 30; x < w; x += 55) {
      ctx.beginPath(); ctx.roundRect(x, 20, 25, 30, 5); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x, h - 50, 25, 30, 5); ctx.fill();
    }
    ctx.fillStyle = '#EE9B00';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('FILM 200', 40, 95);
    ctx.font = '18px monospace';
    ctx.fillText('➡ 14', w - 80, 95); 
    ctx.font = 'bold 16px monospace';
    ctx.fillText('EXP 36 / 2024', 40, h - 85);
    ctx.fillText('MADE IN USA', w - 140, h - 85);
    ctx.strokeStyle = '#EE9B00';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 70, w - 60, h - 140);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 100, 0, 0.2)');
    grad.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 100, 255, 0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
};

export const getSvgBackgroundPreset = (preset: PresetType, w: number, h: number): { defs: string, body: string } => {
  let defs = '';
  let body = '';

  defs += `<filter id="paper-texture-filter">\n<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" stitchTiles="stitch"/>\n<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>\n<feComposite operator="in" in2="SourceGraphic"/>\n</filter>\n`;

  if (preset === 'passport-passbook') {
    defs += `<radialGradient id="passport-vig"><stop offset="30%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(120, 90, 40, 0.2)"/></radialGradient>\n`;
    defs += `<pattern id="pass-data-lines" width="10" height="40" patternUnits="userSpaceOnUse"><rect width="10" height="1.5" y="38" fill="#A83838" opacity="0.4"/></pattern>\n`;

    body += `<g id="Passport-Background">\n`;
    body += `<rect width="100%" height="100%" fill="#E8DFCC"/>\n`;
    body += `<rect width="100%" height="100%" filter="url(#paper-texture-filter)" style="mix-blend-mode: multiply;"/>\n`;
    body += `<rect width="100%" height="${h - 220}" y="120" fill="url(#pass-data-lines)"/>\n`;
    body += `<g id="Figma-Builtin-Border-Style">\n<rect width="${w - 40}" height="80" x="20" y="20" fill="none" stroke="#4A463D" stroke-width="1"/>\n</g>\n`;
    body += `<rect width="40" height="40" x="40" y="40" fill="none" stroke="#4A463D" stroke-width="1"/>\n`;
    body += `<g id="Passport-Text" font-family="monospace" font-weight="bold" font-size="12" fill="#4A463D">\n`;
    body += `<text x="100" y="50">PASSPORT / BANKBOOK</text>\n`;
    body += `<text x="${w - 100}" y="50">A 45 66 12</text>\n`;
    body += `</g>\n`;
    body += `<rect width="180" height="200" x="40" y="${h - 220}" fill="none" stroke="#4A463D" stroke-width="1"/>\n`;
    body += `<text x="100" y="${h - 120}" font-family="monospace" font-size="10" fill="#4A463D">PHOTO</text>\n`;
    body += `<rect width="100%" height="100%" fill="url(#passport-vig)" pointer-events="none"/>\n`;
    body += `</g>\n`;

  } else if (preset === 'retro-newspaper') {
    defs += `<pattern id="news-separator-lines" width="150" height="10" patternUnits="userSpaceOnUse"><rect width="1" height="10" fill="#2A2A2A"/></pattern>\n`;
    body += `<g id="Newspaper-Background">\n`;
    body += `<rect width="100%" height="100%" fill="#CFC5B1"/>\n`;
    body += `<rect width="100%" height="100%" filter="url(#paper-texture-filter)" style="mix-blend-mode: multiply;"/>\n`;
    body += `<g id="Figma-Builtin-Inner-Shadow-Effect">\n<rect width="${w - 60}" height="${h - 60}" x="30" y="30" fill="none" stroke="#2A2A2A" stroke-width="4"/>\n</g>\n`;
    body += `<rect width="${w - 72}" height="${h - 72}" x="36" y="36" fill="none" stroke="#2A2A2A" stroke-width="1"/>\n`;
    body += `<g id="Newspaper-Headings" font-family="monospace" fill="#2A2A2A" text-anchor="middle">\n`;
    body += `<text x="${w/2}" y="80" font-weight="bold" font-size="24">DAILY CHRONICLE</text>\n`;
    body += `<text x="${w/2}" y="105" font-size="12">VOL XC | LONDON | 1895 | PRICE ONE PENNY</text>\n`;
    body += `</g>\n`;
    body += `<rect width="${w - 72}" height="3" x="36" y="120" fill="#2A2A2A"/>\n`;
    body += `<rect width="${w - 72}" height="1" x="36" y="125" fill="#2A2A2A"/>\n`;
    body += `<rect width="${w - 120}" height="${h - 200}" x="60" y="150" fill="url(#news-separator-lines)"/>\n`;
    body += `<rect width="${w - 72}" height="2" x="36" y="${h - 80}" fill="#2A2A2A"/>\n`;
    body += `<text x="${w/2}" y="${h - 55}" fill="#2A2A2A" font-family="monospace" font-weight="bold" font-size="16" text-anchor="middle">CLASSIFIEDS</text>\n`;
    body += `<rect width="100%" height="100%" fill="rgba(107, 78, 35, 0.1)" pointer-events="none"/>\n`;
    body += `</g>\n`;

  } else if (preset === 'OMR-exam-sheet') {
    defs += `<linearGradient id="exam-shadow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="rgba(0,0,0,0.1)"/><stop offset="10%" stop-color="rgba(0,0,0,0)"/></linearGradient>\n`;
    defs += `<pattern id="exam-barcode-patt" width="10" height="30" patternUnits="userSpaceOnUse"><rect width="4" height="10" fill="#0F0F0F"/><rect width="8" height="10" y="15" fill="#0F0F0F"/></pattern>\n`;
    body += `<g id="Exam-Sheet-Background">\n`;
    body += `<rect width="100%" height="100%" fill="#FAFAFA"/>\n`;
    body += `<rect width="100%" height="100%" filter="url(#paper-texture-filter)" style="mix-blend-mode: multiply;" opacity="0.3"/>\n`;
    body += `<rect width="50" height="${h - 240}" x="30" y="120" fill="url(#exam-barcode-patt)"/>\n`;
    body += `<rect width="${w - 130}" height="80" x="100" y="30" fill="none" stroke="#2A2A2A" stroke-width="2"/>\n`;
    body += `<g id="Exam-Text" font-family="monospace" fill="#2A2A2A">\n`;
    body += `<text x="120" y="60" font-weight="bold" font-size="16">SECTION II: OPTICAL MARK READING</text>\n`;
    body += `<text x="120" y="85" font-size="10">PART A: CHOOSE ONE CORRECT OPTION</text>\n`;
    body += `</g>\n`;
    body += `<rect width="${w - 130}" height="1" x="100" y="110" fill="#2A2A2A"/>\n`;
    body += `<g id="Figma-Builtin-Border-Fields">\n<rect width="200" height="60" x="${w - 250}" y="40" fill="none" stroke="#2A2A2A" stroke-width="2"/>\n</g>\n`;
    body += `<g id="OMR-Bubbles" font-family="monospace" font-weight="bold" font-size="12" fill="#2A2A2A" text-anchor="middle">\n`;
    const options = ['A', 'B', 'C', 'D'];
    for(let y = 160; y < h - 40; y += 35) {
        body += `<text x="110" y="${y + 5}">${Math.floor((y - 160)/35) + 1}</text>\n`;
        for(let x = 160; x < w - 60; x += 60) {
            body += `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="#2A2A2A" stroke-width="1"/>\n`;
            if(Math.random() < 0.2) body += `<circle cx="${x}" cy="${y}" r="10" fill="#2A2A2A"/>\n`;
            body += `<text x="${x}" y="${y + 4}" font-size="12">${options[(x - 160) / 60]}</text>\n`; 
        }
    }
    body += `</g>\n`;
    body += `<rect width="100%" height="100%" fill="url(#exam-shadow)" pointer-events="none"/>\n`;
    body += `</g>\n`;

  } else if (preset === 'rolls-film') {
    defs += `<linearGradient id="film-leak-vig" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255, 100, 0, 0.2)"/><stop offset="30%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0, 100, 255, 0.15)"/></linearGradient>\n`;
    defs += `<pattern id="film-sprocket-OM" width="55" height="30" patternUnits="userSpaceOnUse"><rect width="25" height="30" x="20" rx="5" fill="#F0F0F0"/></pattern>\n`;
    body += `<g id="Film-Roll-Background">\n`;
    body += `<rect width="100%" height="100%" fill="#101010"/>\n`;
    body += `<rect width="100%" height="70" fill="#050505"/>\n`;
    body += `<rect width="100%" height="70" y="${h - 70}" fill="#050505"/>\n`;
    body += `<g id="Figma-Builtin-OM-Sprocket">\n`;
    body += `<rect width="100%" height="30" x="30" y="20" fill="url(#film-sprocket-OM)"/>\n`;
    body += `<rect width="100%" height="30" x="30" y="${h - 50}" fill="url(#film-sprocket-OM)"/>\n`;
    body += `</g>\n`;
    body += `<g id="Film-Text" font-family="monospace" fill="#EE9B00" font-weight="bold">\n`;
    body += `<text x="40" y="95" font-size="20">FILM 200</text>\n`;
    body += `<text x="${w - 80}" y="95" font-size="18">➡ 14</text>\n`; 
    body += `<text x="40" y="${h - 85}" font-size="16">EXP 36 / 2024</text>\n`;
    body += `<text x="${w - 140}" y="${h - 85}" font-size="16">MADE IN USA</text>\n`;
    body += `</g>\n`;
    body += `<g id="Figma-Builtin-Content-Border">\n<rect width="${w - 60}" height="${h - 140}" x="30" y="70" fill="none" stroke="#EE9B00" stroke-width="1.5"/>\n</g>\n`;
    body += `<rect width="100%" height="100%" fill="url(#film-leak-vig)" pointer-events="none"/>\n`;
    body += `</g>\n`;
  }
  return { defs, body };
};
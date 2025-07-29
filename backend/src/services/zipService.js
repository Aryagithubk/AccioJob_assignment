const JSZip = require('jszip');

exports.generateZipBuffer = async (jsx, css, title) => {
  const zip = new JSZip();
  const folder = zip.folder(title || 'component');

  // Remove ```jsx or ``` from start/end if present
  let cleanJsx = jsx.trim();
  if (cleanJsx.startsWith('```jsx')) {
    cleanJsx = cleanJsx.replace(/^```jsx/, '').trim();
  }
  if (cleanJsx.startsWith('```')) {
    cleanJsx = cleanJsx.replace(/^```/, '').trim();
  }
  if (cleanJsx.endsWith('```')) {
    cleanJsx = cleanJsx.replace(/```$/, '').trim();
  }

  folder.file('index.jsx', cleanJsx || '');
  folder.file('styles.css', css || '');

  return await zip.generateAsync({ type: 'nodebuffer' });
};
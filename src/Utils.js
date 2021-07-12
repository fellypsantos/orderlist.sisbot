export default {
  DownloadTextFile: (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  Sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  StyleHelper: {
    TextAlign: (value) => ({textAlign: `${value}`}),
    MaxWidthinPixels: (value) => ({maxWidth: `${value}px`}),
  },
};

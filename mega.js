const mega = require("megajs");

// Use env vars for security (set in Replit secrets or .env)
let email = process.env.MEGA_EMAIL || 'sadasthemi@gmail.com'; // Update to env
let pw = process.env.MEGA_PW || 'godesadas2000@'; // Update to env

// User agent for headers
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const auth = { email, password: pw, userAgent }; // Clean auth object

// Simple upload function
const upload = (inputStream, fileName) => {
  return new Promise((resolve, reject) => {
    const client = new mega.Client(auth, (error) => {
      if (error) return reject(error);

      const uploadPromise = client.upload(inputStream, { name: fileName });
      uploadPromise.then((result) => {
        result.link((error, link) => {
          if (error) return reject(error);
          client.close();
          resolve(link);
        });
      }).catch(reject);
    });

    client.on('error', reject);
  });
};

module.exports = { upload };

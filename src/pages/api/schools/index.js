import { put } from '@vercel/blob';
import serverlessMysql from 'serverless-mysql';
import { IncomingForm } from 'formidable';
import fs from 'fs';

const db = serverlessMysql({
  config: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      // This is the fix for the self-signed certificate error
      rejectUnauthorized: false,
    },
  },
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const results = await db.query('SELECT * FROM schools ORDER BY id DESC');
      return res.status(200).json(results);
    } catch (error) {
      console.error("GET request database error:", error);
      return res.status(500).json({ error: 'Failed to fetch school data.' });
    }
  }

  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Error parsing form data.' });

      let imageUrl = null;
      const imageFile = files.image?.[0];
      if (imageFile) {
        try {
          const fileContents = fs.readFileSync(imageFile.filepath);
          const fileName = `${Date.now()}_${imageFile.originalFilename}`;
          // This is the fix for the Blob token when running outside Vercel
          const blob = await put(fileName, fileContents, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
          });
          imageUrl = blob.url;
        } catch (uploadError) {
          console.error("Blob upload error:", uploadError);
          return res.status(500).json({ error: 'Failed to upload image.' });
        }
      }

      try {
        const { name, address, city, state, contact, email_id } = fields;
        const query = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [name?.[0], address?.[0], city?.[0], state?.[0], contact?.[0], imageUrl, email_id?.[0]];
        await db.query(query, values);

        return res.status(201).json({ message: 'School added successfully!' });
      } catch (dbError) {
        console.error("Database insert error:", dbError);
        return res.status(500).json({ error: 'Failed to save school to the database.' });
      }
    });
  }
}
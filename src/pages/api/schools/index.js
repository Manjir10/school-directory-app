import { put } from '@vercel/blob';
import serverlessMysql from 'serverless-mysql';
import { IncomingForm } from 'formidable';
import fs from 'fs';

// Configure the database connection with a longer timeout
const db = serverlessMysql({
  config: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
    },
    connectTimeout: 30000 // Wait for 30 seconds before timing out
  },
});

export const config = { api: { bodyParser: false } };

// The rest of the handler logic is the same...
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
          const blob = await put(fileName, fileContents, { access: 'public' });
          imageUrl = blob.url;
        } catch (uploadError) {
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
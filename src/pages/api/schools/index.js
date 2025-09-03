import { put } from '@vercel/blob';
import mysql from 'mysql2/promise';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function dbConnect() {
  return await mysql.createConnection(process.env.DATABASE_URL);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await dbConnect();
      const [rows] = await connection.execute('SELECT * FROM schools ORDER BY id DESC');
      connection.end();
      return res.status(200).json(rows);
    } catch (error) {
      console.error("GET request database error:", error);
      return res.status(500).json({ error: 'Failed to fetch school data.' });
    }
  }

  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).json({ error: 'Error parsing form data.' });
      }

      const imageFile = files.image?.[0];
      if (!imageFile) {
        return res.status(400).json({ error: 'Image file is required.' });
      }

      let imageUrl = null;
      try {
        const fileContents = fs.readFileSync(imageFile.filepath);
        const fileName = `${Date.now()}_${imageFile.originalFilename}`;
        
        const blob = await put(fileName, fileContents, { access: 'public' });
        imageUrl = blob.url;

      } catch (uploadError) {
        // --- THIS LOG WAS MISSING ---
        console.error("Vercel Blob upload error:", uploadError);
        // --- END OF FIX ---
        return res.status(500).json({ error: 'Failed to upload image.' });
      }

      const { name, address, city, state, contact, email_id } = fields;

      try {
        const connection = await dbConnect();
        const query = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await connection.execute(query, [
          name?.[0], address?.[0], city?.[0], state?.[0], contact?.[0], imageUrl, email_id?.[0]
        ]);
        connection.end();
        return res.status(201).json({ message: 'School added successfully!' });
      } catch (dbError) {
        console.error("Database insert error:", dbError);
        return res.status(500).json({ error: 'Failed to save school to the database.' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
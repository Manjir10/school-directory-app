import mysql from 'mysql2/promise';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

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
      console.error("Database connection error:", error);
      return res.status(500).json({ error: 'Failed to fetch school data.' });
    }
  }

  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Error parsing form data.' });

      const imageFile = files.image?.[0];
      let dbImagePath = null;

      if (imageFile) {
        const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const fileName = `${Date.now()}_${imageFile.originalFilename}`;
        const newImagePath = path.join(uploadDir, fileName);

        // --- THIS IS THE FIX ---
        // We now copy the file instead of renaming (moving) it.
        fs.copyFileSync(imageFile.filepath, newImagePath);
        // --- END OF FIX ---

        dbImagePath = `/schoolImages/${fileName}`;
      }

      const { name, address, city, state, contact, email_id } = fields;

      try {
        const connection = await dbConnect();
        const query = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await connection.execute(query, [name?.[0], address?.[0], city?.[0], state?.[0], contact?.[0], dbImagePath, email_id?.[0]]);
        connection.end();
        return res.status(201).json({ message: 'School added successfully!' });
      } catch (error) {
        console.error("Database insert error:", error);
        return res.status(500).json({ error: 'Failed to save to database.' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
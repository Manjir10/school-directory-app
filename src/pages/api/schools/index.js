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
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await dbConnect();
      const [rows] = await connection.execute('SELECT * FROM schools ORDER BY id DESC');
      connection.end();
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch school data.' });
    }
  }

  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data.' });
      }

      const imageFile = files.image?.[0];
      let dbImagePath = null;

      if (imageFile) {
        // This path ensures images are saved in a publicly accessible folder
        const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
        // This fulfills the requirement to store the image in a folder named 'schoolImages' 
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${Date.now()}_${imageFile.originalFilename}`;
        const newImagePath = path.join(uploadDir, fileName);
        fs.renameSync(imageFile.filepath, newImagePath);
        dbImagePath = `/schoolImages/${fileName}`;
      }

      const { name, address, city, state, contact, email_id } = fields;

      try {
        const connection = await dbConnect();
        const query = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await connection.execute(query, [
          name?.[0], address?.[0], city?.[0], state?.[0], contact?.[0], dbImagePath, email_id?.[0]
        ]);
        connection.end();
        return res.status(201).json({ message: 'School added successfully!' });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to save school to the database.' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
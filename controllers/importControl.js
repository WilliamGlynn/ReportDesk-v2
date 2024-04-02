import fs from 'fs';
import { parse } from 'csv-parse';
import { getLocationID, getCourseID, getDurationID, insertQuestions } from '../models/database.js';

export const importData = async (req, res) => {
    try {
      const file = req.file;
      const data = await parseFile(file.path);
  
      for (const record of data) {
        const { location, duration, course, notes, date } = record;
  
        // Parse and convert the date format
        const [month, day, year] = date.split('/');
        const formattedDate = `${year}-${month}-${day}`;
  
        // Retrieve IDs for location, course, and duration
        const locationIDResult = await getLocationID(location);
        const durationIDResult = await getDurationID(duration);
        const courseIDResult = await getCourseID(course);
  
        // Extract IDs from the result objects
        const locationID = locationIDResult[0].locationID;
        const durationID = durationIDResult[0].durationID;
        const courseID = courseIDResult[0].courseID;
  
        // Insert question into the database
        await insertQuestions(locationID, durationID, courseID, notes, formattedDate);
      }
  
      res.status(200).json({ message: 'Data imported successfully.' });
    } catch (error) {
      console.error('Error during data import:', error);
      res.status(500).json({ error: 'An error occurred during data import.' });
    }
  };

function parseFile(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ',', from_line: 3 })) // Start from line 2 to skip header
      .on('data', (row) => {
        // Validate row data and push to array
        if (row.length === 5) { // Ensure correct number of columns
          const [location, duration, course, notes, date] = row;
          data.push({ location, duration, course, notes, date });
        } else {
          console.warn('Invalid row:', row);
        }
      })
      .on('error', (error) => {
        reject(error);
      })
      .on('end', () => {
        resolve(data);
      });
  });
}

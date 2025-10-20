// api/lineup.js - שלוף ליינאפ משחק מסוים

export default async function handler(req, res) {
  // אפשר גישה מכל המקורות (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // אם זה preflight request - חזור בהצלחה
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // קבל את ה-API Key מ-Environment Variables
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  
  // קבל את ה-fixtureId מהquery parameters
  const { fixtureId } = req.query;

  if (!fixtureId) {
    return res.status(400).json({ שגיאה: 'fixtureId נדרש' });
  }

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ שגיאה: 'API Key לא מוגדר' });
  }

  try {
    // קרא ל-API-Football כדי לקבל ליינאפ
    const response = await fetch(
      `https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups?fixture=${fixtureId}&team=541`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      }
    );

    // אם ה-API חזר בשגיאה
    if (!response.ok) {
      throw new Error(`שגיאת API: ${response.status}`);
    }

    // המר את התשובה ל-JSON
    const data = await response.json();

    // שלח את התוצאה חזרה לקלای
    res.status(200).json(data);

  } catch (error) {
    console.error('שגיאה:', error);
    res.status(500).json({ שגיאה: error.message });
  }
}

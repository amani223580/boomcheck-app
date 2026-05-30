// api/gemini-advice.js
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { userData, score } = req.body;

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // Mfumo wa maelekezo (Prompt Engineering) kwa ajili ya ushauri wa kipekee
        const prompt = `Wewe ni mtaalamu mwandamizi wa uchambuzi wa mikopo ya HESLB Tanzania. Mwanafunzi anaitwa ${userData.jina}, amesoma shule ya ${userData.shuleAina} (${userData.shuleJina}), kozi yake ipo ${userData.kozi}, na hali ya familia/wazazi wake ipo hivi: ${userData.wazazi}. Uwezekano wake uliopigiwa hesabu na mtambo wetu ni ${score}%. Mpe ushauri wa kitaalamu, wa kina sana, wa kishujaa na wenye matumaini makubwa kwa kutumia lugha ya Kiswahili inayochangamka na ya kirafiki. Eleza nini afanye ili kulinda nafasi yake au mbinu mbadala kama ana asilimia ndogo. Tumia HTML tags kama <b> au <br> kwa mpangilio mzuri wa aya (Usitumie alama za kiofisi au markdown za kawaida kama vizibo vya nyota).`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const adviceText = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ advice: adviceText });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

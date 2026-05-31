// api/verify-manual.js
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { txnId, nida } = req.body;

    // Ulinzi wa Msingi: Hakikisha namba ya muamala imeingizwa na ina urefu wa kutosha
    if (!txnId || txnId.trim().length < 6) {
        return res.status(200).json({ valid: false, message: 'Namba ya muamala sio sahihi au ni fupi mno.' });
    }

    try {
        // Kwa sasa kwenye majaribio, muamala wowote wenye urefu sahihi unakubalika.
        // Hapa mbeleni unaweza kuunganisha na Database yako ya kuhifadhi miamala iliyotumiwa ili kuzuia mtu mmoja kutumia namba moja mara mbili.
        return res.status(200).json({ valid: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

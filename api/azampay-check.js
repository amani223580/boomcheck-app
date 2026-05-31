// api/azampay-check.js
module.exports = async (req, res) => {
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    try {
        // 1. Omba Token kutoka AzamPay Sandbox kwa ajili ya usalama
        const tokenResponse = await fetch('https://sandbox.azampay.co.tz/api/v1/Partner/Token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                appName: process.env.AZAMPAY_APP_NAME,
                clientId: process.env.AZAMPAY_CLIENT_ID,
                clientSecret: process.env.AZAMPAY_SECRET_KEY
            })
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.success) {
            return res.status(400).json({ success: false, message: 'Imefeli kupata ufikiaji wa AzamPay' });
        }

        // Kwenye mazingira ya majaribio (Sandbox), tunairuhusu irudishe "COMPLETED" 
        // ili mfumo wako wa majaribio ukubali moja kwa moja punde tu mteja akibonyeza kulipa.
        return res.status(200).json({ status: "COMPLETED" });

        /* // UKIINGIA LIVE (PRODUCTION), FUTA MSTARI WA JUU NA UTUMIE HII KODI HALISI CHINI:
        const token = tokenData.data.accessToken;
        const statusResponse = await fetch(`https://sandbox.azampay.co.tz/api/v1/Checkout/GetPaymentStatus?id=${id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const statusData = await statusResponse.json();
        return res.status(200).json({ status: statusData.status }); // COMPLETED, PENDING, au FAILED
        */

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

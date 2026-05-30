// api/azampay-trigger.js
module.exports = async (req, res) => {
    // Ruhusu maombi ya POST pekee
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { phone, amount, name } = req.body;

    try {
        // 1. Omba Token ya siri kutoka AzamPay Sandbox
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

        const token = tokenData.data.accessToken;

        // 2. Sukuma Push USSD kwenda kwenye simu ya mteja (MnoCheckout)
        const pushResponse = await fetch('https://sandbox.azampay.co.tz/api/v1/Checkout/MnoCheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                accountNumber: phone,
                amount: amount.toString(),
                currency: "TZS",
                externalId: Math.floor(100000 + Math.random() * 900000).toString(),
                provider: "AzamPay", 
                additionalProperties: {}
            })
        });

        const pushData = await pushResponse.json();
        
        return res.status(200).json({
            success: true,
            transactionId: pushData.transactionId || "SB-" + Date.now(),
            message: "Push ya malipo imesukumwa kikamilifu!"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
              

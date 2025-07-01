const https = require('https');

exports.handler = async (event) => {
    const apiKey = process.env.API_KEY || '4bcee0035edd5e5c479bec123991cbd0';
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=INR,XAU`;

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const goldPerUSD = parsed.rates?.XAU;
                    const usdToInr = parsed.rates?.INR;

                    const goldPerOunceUSD = 1 / goldPerUSD;
                    const goldPerOunceINR = goldPerOunceUSD * usdToInr;

                    const message = `The current gold price is ₹${goldPerOunceINR.toFixed(2)} per ounce.`;

                    // ✅ Return Lex V2 format
                    resolve({
                        sessionState: {
                            dialogAction: {
                                type: 'Close'
                            },
                            intent: {
                                name: event.sessionState.intent.name,
                                state: 'Fulfilled'
                            }
                        },
                        messages: [
                            {
                                contentType: 'PlainText',
                                content: message
                            }
                        ]
                    });

                } catch (err) {
                    resolve({
                        sessionState: {
                            dialogAction: {
                                type: 'Close'
                            },
                            intent: {
                                name: event.sessionState.intent.name,
                                state: 'Failed'
                            }
                        },
                        messages: [
                            {
                                contentType: 'PlainText',
                                content: 'Could not parse gold rate.'
                            }
                        ]
                    });
                }
            });
        }).on('error', err => {
            resolve({
                sessionState: {
                    dialogAction: {
                        type: 'Close'
                    },
                    intent: {
                        name: event.sessionState.intent.name,
                        state: 'Failed'
                    }
                },
                messages: [
                    {
                        contentType: 'PlainText',
                        content: 'Error fetching gold rate.'
                    }
                ]
            });
        });
    });
};

// Assuming you're using Node.js with Express.js for handling HTTP requests
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint to handle Warpcast POST requests
app.post('/warpcast', async (req, res) => {
    // Extract data from the request body
    const { untrustedData, trustedData } = req.body;

    // Check if trustedData exists
    if (!trustedData) {
        console.error('Error: trustedData is missing.');
        return res.status(400).send('Error: trustedData is missing.');
    }

    try {
        // Send trustedData to verifiedMessage endpoint on Hub for verification
        const hubResponse = await fetch('https://yourhub.com/verifiedMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trustedData })
        });

        // Check if the request to the Hub was successful
        if (hubResponse.ok) {
            // Extract the verified message from the response
            const verifiedMessage = await hubResponse.json();

            // Now you can use the verified message for further processing
            console.log('Verified Message:', verifiedMessage);

            // Example: Extract button id from the verified message
            const buttonId = verifiedMessage.buttonId;
            
            // Example: Perform action based on the button clicked
            switch (buttonId) {
                case 1:
                    console.log('Green button clicked');
                    break;
                case 2:
                    console.log('Purple button clicked');
                    break;
                case 3:
                    console.log('Red button clicked');
                    break;
                case 4:
                    console.log('Blue button clicked');
                    break;
                default:
                    console.log('Unknown button clicked');
            }

            // Respond to Warpcast indicating successful processing
            res.status(200).send('Success');
        } else {
            console.error('Error:', hubResponse.statusText);
            res.status(500).send('Error: Unable to verify message');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error: Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

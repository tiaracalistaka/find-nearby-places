// app/api/places/route.js

import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(req) {
    try {
        const urlParams = new URLSearchParams(req.url.split('?')[1]); // Parse query parameters
        const lat = urlParams.get('lat');
        const lng = urlParams.get('lng');
        const category = urlParams.get('category');

        if (!lat || !lng || !category) {
            return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
        }

        const response = await axios.get(BASE_URL + '/json?', {
            params: {
                location: `${lat},${lng}`,
                radius: 5000,
                type: category,
                key: GOOGLE_API_KEY,
            }
        });

        const data = response.data;

        if (data.results.length === 0) {
            return new Response(JSON.stringify({ message: "No places found" }), { status: 404 });
        }

        // Sorting places by rating
        data.results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return new Response(JSON.stringify(data.results), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

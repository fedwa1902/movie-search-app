const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const { title, id } = event.queryStringParameters;
        const apiKey = process.env.MOVIE_API_KEY;

        let url = `https://www.omdbapi.com/?apikey=${apiKey}`;

        if (title) {
            // Search for movies by title
            url += `&s=${encodeURIComponent(title)}`;
        } else if (id) {
            // Get full movie details by IMDb ID
            url += `&i=${encodeURIComponent(id)}&plot=full`;
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing title or id parameter" }),
            };
        }

        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed fetching data",
                details: error.message,
            }),
        };
    }
};

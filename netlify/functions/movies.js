// netlify/functions/movies.js
const fetch = require("node-fetch"); // only if needed

exports.handler = async function(event, context) {
    const title = event.queryStringParameters.title;
    const apiKey = process.env.MOVIE_API_KEY; // store your key in Netlify

    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`);
    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

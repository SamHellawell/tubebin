import axios from 'axios';

export default async function searchSuggestionsAPI(req, res) {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.status(200).json([]);
    return;
  }
  try {
    const searchResults = await axios.get(`https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&hl=en-gb&gl=nl&gs_rn=64&gs_ri=youtube&ds=yt&cp=5&gs_id=k&q=${searchQuery}&xhr=t&xssi=t`);
    const jsonResults = JSON.parse(searchResults.data.substr(4));
    res.status(200).json(
      jsonResults.length > 1 ? jsonResults[1].map(r => r[0]) : []
    );
  } catch (e) {
    res.status(200).json([]);
  }
}

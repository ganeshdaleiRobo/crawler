async function fetchHTMLFromWebSit(url) {
    let response = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const html = response;
    const $ = cheerio.load(html);
    return $;
  }
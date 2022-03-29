const axios = require("axios");
(async () => {
  const r = await axios.get(
    "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=365"
  );
  const data = r.data;
  console.log(data.Data.Data);
})();

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Currency from "../../components/Currency";

const Converter = () => {
  const [currency, setCurrency] = useState({});
  useEffect(() => {
    axios
      .get("https://api.exchangerate.host/latest")
      .then((res) => setCurrency(res.data.rates));
  }, []);

  const currencyList = Object.keys(currency);

  return (
    <>
      <Currency currencyArray={currencyList} />
    </>
  );
};

export default Converter;

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import CurrencyDropdown from "../../components/CurrencyDropdown";

const Converter = () => {
  const [currency, setCurrency] = useState({});
  // const arr = ["a", "b", "c", "d", "e", "f", "g"];
  useEffect(() => {
    axios
      .get("https://api.exchangerate.host/latest")
      // .then((res) => console.log(res.data.rates));
      .then((res) => setCurrency(res.data.rates));
  }, []);

  const currencyList = Object.keys(currency);

  return (
    <>
      <CurrencyDropdown currencyArray={currencyList} />
    </>
  );
};

export default Converter;

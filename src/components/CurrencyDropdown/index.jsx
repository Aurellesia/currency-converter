import "../../style/sass/styles.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { CanvasJSChart } from "canvasjs-react-charts";

const CurrencyDropdown = ({ currencyArray }) => {
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const [openFour, setOpenFour] = useState(false);
  const [openFive, setOpenFive] = useState(false);
  const [selectedOne, setSelectedOne] = useState("USD");
  const [selectedTwo, setSelectedTwo] = useState("EUR");
  const [selectedThree, setSelectedThree] = useState("OMR");
  const [selectedFour, setSelectedFour] = useState("KWD");
  const [selectedFive, setSelectedFive] = useState("GBP");
  const [selected, setSelected] = useState(["USD", "EUR", "OMR", "KWD", "GBP"]);
  const [base, setBase] = useState("USD");
  const [result, setResult] = useState({});
  const [symbol, setSymbol] = useState(["USD", "EUR", "OMR", "KWD", "GBP"]);
  const [dataOne, setDataOne] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const [dataThree, setDataThree] = useState([]);
  const [dataFour, setDataFour] = useState([]);
  let tempOne = [];
  let tempTwo = [];
  let tempThree = [];
  let tempFour = [];

  let amount = result[base] ? result[base] : 1;

  const twoDigit = (val) => {
    return ("0" + val).slice(-2);
  };

  const formatDate = (date, month, year) => {
    return `${year}-${twoDigit(month + 1)}-${twoDigit(date)}`;
  };
  const newDate = new Date();
  const twoWeeksAgo = new Date(new Date().setDate(newDate.getDate() - 15));
  const daysAgo = formatDate(
    twoWeeksAgo.getDate(),
    twoWeeksAgo.getMonth(),

    twoWeeksAgo.getFullYear()
  );
  const now = formatDate(
    newDate.getDate(),
    newDate.getMonth(),
    newDate.getFullYear()
  );

  const toggle = (e) => {
    if (e.target.className === "dropdown1") {
      setOpenOne(!openOne);
    } else if (e.target.className === "dropdown2") {
      setOpenTwo(!openTwo);
    } else if (e.target.className === "dropdown3") {
      setOpenThree(!openThree);
    } else if (e.target.className === "dropdown4") {
      setOpenFour(!openFour);
    } else if (e.target.className === "dropdown5") {
      setOpenFive(!openFive);
    }
  };

  const selectedOption = (e, value) => {
    const parent = e.target.parentNode.className;
    if (parent === "droplist1") {
      selected.splice(0, 1, value);
      setSelectedOne(value);
      setOpenOne(false);
    } else if (parent === "droplist2") {
      selected.splice(1, 1, value);
      setSelectedTwo(value);
      setOpenTwo(false);
    } else if (parent === "droplist3") {
      selected.splice(2, 1, value);
      setSelectedThree(value);
      setOpenThree(false);
    } else if (parent === "droplist4") {
      selected.splice(3, 1, value);
      setSelectedFour(value);
      setOpenFour(false);
    } else if (parent === "droplist5") {
      selected.splice(4, 1, value);
      setSelectedFive(value);
      setOpenFive(false);
    }
  };

  const selectedYet = (val) => {
    if (selected.includes(val)) {
      return "selected-yet";
    }
  };

  const defineSymbol = () => {
    setSymbol(selected.filter((item) => item !== base));
    return symbol;
  };
  useEffect(() => {
    axios
      .get(
        `https://api.exchangerate.host/latest?base=${base}&amount=${amount}&symbols=${selected}`
      )
      .then((res) => setResult(res.data.rates));
    defineSymbol();
  }, [base, amount, selected]);

  useEffect(() => {
    axios
      .get(
        `https://api.exchangerate.host/timeseries?base=${base}&start_date=${daysAgo}&end_date=${now}&symbols=${symbol}`
      )
      .then((res) => {
        Object.entries(res.data.rates).forEach(([key, value]) => {
          tempOne.push({ y: value[`${symbol[0]}`], label: key });
          tempTwo.push({ y: value[`${symbol[1]}`], label: key });
          tempThree.push({ y: value[`${symbol[2]}`], label: key });
          tempFour.push({ y: value[`${symbol[3]}`], label: key });
        });
        setDataOne(tempOne);
        tempOne = [];
        setDataTwo(tempTwo);
        tempTwo = [];
        setDataThree(tempThree);
        tempThree = [];
        setDataFour(tempFour);
        tempFour = [];
      });
  }, [symbol]);

  const options = {
    animationEnabled: true,
    title: {
      text: "Currency History Last 15 Days",
      fontSize: 25,
      margin: 20,
      padding: 4,
      fontFamily: "arial",
      fontWeight: "bold",
    },
    axisX: {
      margin: 20,
      labelFontSize: 12,
    },
    axisY: {
      title: "Amount",
      titleFontSize: 20,
      labelFontSize: 12,
    },
    toolTip: {
      shared: true,
    },
    width: 1000,
    height: 500,
    data: [
      {
        type: "spline",
        name: symbol[0],
        showInLegend: true,
        dataPoints: dataOne,
      },
      {
        type: "spline",
        name: symbol[1],
        showInLegend: true,
        dataPoints: dataTwo,
      },
      {
        type: "spline",
        name: symbol[2],
        showInLegend: true,
        dataPoints: dataThree,
      },
      {
        type: "spline",
        name: symbol[3],
        showInLegend: true,
        dataPoints: dataFour,
      },
    ],
  };
  return (
    <div className="big-container">
      <div className="chart">
        <CanvasJSChart options={options} />
      </div>
      <div className="container">
        <div className="dropdown-container">
          <input
            type="text"
            className="input1"
            onFocus={() => {
              setBase(selectedOne);
            }}
            onChange={(e) => {
              setResult((prev) => ({
                ...prev,
                [base]: Number(e.target.value),
              }));
            }}
            value={result[`${selectedOne}`] || ""}
          />
          <div className="dropdown1" onClick={toggle}>
            {selectedOne || "Select Currency"}
          </div>
          {openOne && (
            <div className="droplist1">
              {currencyArray.map((item) => {
                return (
                  <div
                    className={`list-item ${selectedYet(item)}`}
                    onClick={(e) => {
                      selectedOption(e, item);
                      setBase(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <input
            type="text"
            className="input2"
            onFocus={() => {
              setBase(selectedTwo);
            }}
            onChange={(e) => {
              setResult((prev) => ({
                ...prev,
                [base]: Number(e.target.value),
              }));
            }}
            value={result[`${selectedTwo}`] || ""}
          />
          <div className="dropdown2" onClick={toggle}>
            {selectedTwo || "Select Currency"}
          </div>
          {openTwo && (
            <div className="droplist2">
              {currencyArray.map((item) => {
                return (
                  <div
                    className="list-item"
                    onClick={(e) => {
                      selectedOption(e, item);
                      setBase(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <input
            type="text"
            className="input3"
            onFocus={() => {
              setBase(selectedThree);
            }}
            onChange={(e) => {
              setResult((prev) => ({
                ...prev,
                [base]: Number(e.target.value),
              }));
            }}
            value={result[`${selectedThree}`] || ""}
          />
          <div className="dropdown3" onClick={toggle}>
            {selectedThree || "Select Currency"}
          </div>
          {openThree && (
            <div className="droplist3">
              {currencyArray.map((item) => {
                return (
                  <div
                    className="list-item"
                    onClick={(e) => {
                      selectedOption(e, item);
                      setBase(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <input
            type="text"
            className="input4"
            onFocus={() => {
              setBase(selectedFour);
            }}
            onChange={(e) => {
              setResult((prev) => ({
                ...prev,
                [base]: Number(e.target.value),
              }));
            }}
            value={result[`${selectedFour}`] || ""}
          />
          <div className="dropdown4" onClick={toggle}>
            {selectedFour || "Select Currency"}
          </div>
          {openFour && (
            <div className="droplist4">
              {currencyArray.map((item) => {
                return (
                  <div
                    className="list-item"
                    onClick={(e) => {
                      selectedOption(e, item);
                      setBase(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <input
            type="text"
            className="input5"
            onFocus={() => {
              setBase(selectedFive);
            }}
            onChange={(e) => {
              setResult((prev) => ({
                ...prev,
                [base]: Number(e.target.value),
              }));
            }}
            value={result[`${selectedFive}`] || ""}
          />
          <div className="dropdown5" onClick={toggle}>
            {selectedFive || "Select Currency"}
          </div>
          {openFive && (
            <div className="droplist5">
              {currencyArray.map((item) => {
                return (
                  <div
                    className="list-item"
                    onClick={(e) => {
                      selectedOption(e, item);
                      setBase(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyDropdown;

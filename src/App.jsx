import "./App.css";
import Test from "./Test";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

//import material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import Button from "@mui/material/Button";

//external import
import axios from "axios";
import translation from "./locales/ar/translation.json";
import { motion } from "motion/react";
import moment from "moment";
import "moment/dist/locale/ar"; // ✅   تحميل اللغة العربية
moment.locale("ar"); // ✅ تفعيل اللغة العربية
// react
import { useEffect, useState } from "react";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
let cancelAxios = null;

function App() {
  //STATES
  const { t, i18n } = useTranslation();
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale, setLocale] = useState("ar");
  const [city, setCity] = useState("Riyadh"); // المدينة الحالية
  const [searchCity, setSearchCity] = useState(""); // اللي المستخدم بيكتبها
  const [background, setBackground] = useState("");

  const direction = locale == "ar" ? "rtl" : "ltr";

  //EVNT HANDLERLS
  function handleLanguageClick() {
    if (locale == "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }
  function handleSearch() {
    if (!searchCity.trim()) return;

    setCity(searchCity);
    setSearchCity(""); // نفضي حقل الإدخال بعد البحث
  }

  useEffect(() => {
    // نحدّث التاريخ والوقت كل ثانية
    const interval = setInterval(() => {
      setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    // تنظيف عند فك الكمبوننت
    return () => clearInterval(interval);
  }, [locale]); // لما اللغة تتغير نعيد تنسيق الوقت حسب الـ locale

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);

  useEffect(() => {
    // Make a request for a user with a given ID
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fbb46962a8154607f8cb2292bc54829a&units=metric&lang=${locale}`,
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )

      .then(function (response) {
        const main = response.data.weather[0].main.toLowerCase();

        // 🎨 تحديد الخلفية حسب الحالة الجوية
        if (main.includes("clear"))
          setBackground("linear-gradient(135deg, #a1c4fd, #c2e9fb)");
        else if (main.includes("cloud"))
          setBackground("linear-gradient(135deg, #d7d2cc, #304352)");
        else if (main.includes("rain"))
          setBackground(
            "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)"
          );
        else if (main.includes("snow"))
          setBackground("linear-gradient(135deg, #e6dada, #274046)");
        else if (main.includes("thunderstorm"))
          setBackground("linear-gradient(135deg, #141e30, #243b55)");
        else setBackground("linear-gradient(135deg, #fdfbfb, #ebedee)");

        // handle success
        const responseTemp = Math.round(response.data.main.temp);
        const min = Math.round(response.data.main.temp_min);
        const max = Math.round(response.data.main.temp_max);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;

        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
        console.log(min, max, description);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      cancelAxios();
    };
  }, [city, locale]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="sm"
          style={{
            background: background,
            // minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background 1s ease-in-out",
          }}
        >
          {/* CITY INPUT */}

          {/* ==CITY INPUT== */}

          {/* CARD */}
          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              width: "100%",
              background: "rgb(28 52 91 /36%)",
              color: "white",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
            }}
            dir={direction}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder={
                  locale === "ar" ? "اكتب اسم المدينة" : "Enter city name"
                }
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                  width: "60%",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                {locale === "ar" ? "بحث" : "Search"}
              </Button>
            </div>
            {/* ==CARD== */}

            {/* CONTENT */}
            <div>
              {/* CITY & TIME */}
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "start",
                }}
                dir={direction}
              >
                <Typography
                  variant="h2"
                  style={{ marginRight: "20px", fontWeight: "600" }}
                >
                  {locale === "ar"
                    ? translation.cityTranslations[city] || city
                    : city}
                </Typography>
                <Typography variant="h5" style={{ marginRight: "20px" }}>
                  {dateAndTime}
                </Typography>
              </div>
              {/*== CITY & TIME== */}
              <hr />
              {/* CONTAINER OF DEGREE + CLOUD ICON */}
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* DEGREE & DESCRIPTION */}
                <div>
                  {/* TEMPERATURE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h1" style={{ textAlign: "right" }}>
                      {temp.number}
                    </Typography>
                    <img src={temp.icon} />
                  </div>
                  {/* ==TEMPERATURE== */}
                  <Typography variant="h6" style={{}}>
                    {t(temp.description)}
                  </Typography>
                  {/* MIN & MAX */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>
                      {t("min")}:{temp.min}
                    </h5>
                    <h5 style={{ margin: "0px 5px" }}>|</h5>
                    <h5>
                      {t("max")}:{temp.max}
                    </h5>
                  </div>
                </div>
                {/* ==DEGREE & DESCRIPTION== */}
                <CloudQueueIcon
                  style={{ fontSize: "200px", color: "white" }}
                ></CloudQueueIcon>
              </div>
              {/* ==CONTAINER OF DEGREE + CLOUD ICON == */}
            </div>
            {/* ==CONTENT== */}
            {/* ==CARD== */}
            {/* TRANSLATION CONTAINR */}
            <div
              dir={direction}
              style={{ display: "flex", width: "100%", justifyContent: "end" }}
            >
              <Button
                variant="text"
                style={{ color: "white", marginTop: "20px" }}
                onClick={handleLanguageClick}
              >
                {locale == "en" ? "Arabic" : "انجليزي"}
              </Button>
            </div>
          </motion.div>
          {/* ==TRANSLATION CONTAINR== */}

          {/* ==CONTENT CONTAINER== */}
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

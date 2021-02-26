import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import Axios from 'axios'

import DashboardPage from "../views/Dashboard/Dashboard.js";
import UserProfile from "../views/UserProfile/UserProfile.js";

let ps;


const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const [stockHoldings, setStockHoldings] = useState([]);
    const [totalInvestments, setTotalInvestments] = useState(0);

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {

      Axios.get("http://localhost:3001/investments/1").then((response) => {
        var data = []
        var total_investments = 0
        response.data.forEach(element => {
          data.push([element.stock_id, element.stock_nam, element.quantity, element.buy_price]);
          total_investments += element.quantity*element.buy_price;
        });
        setStockHoldings(data)
        setTotalInvestments(total_investments);
      }).catch((err) => console.log(err))



      
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  });

  const switchRoutes = (
        <Switch>
          {routes.map((prop, key) => {
            if (prop.layout === "/admin") {
              if( prop.path === "/dashboard")
              {
              
              return (
                    <Route
                      path={prop.layout + prop.path}
                      render={(props) => (
                          < prop.component {...props} stocksHoldings={stockHoldings} totalInvestments={totalInvestments} />   )}
                      key={key}
                    />
                  );
              }
              else{
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                />
              );
              }
            }
            return null;
          })}
          <Redirect from="/admin" to="/admin/dashboard" />
        </Switch> )

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"PfolioX"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
         
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {getRoute() ? <Footer /> : null}
      </div>
    </div>
  );
}

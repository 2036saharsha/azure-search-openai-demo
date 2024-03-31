import { Outlet, NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import github from "../../assets/github.svg";

import styles from "./Layout.module.css";

import { useLogin } from "../../authConfig";

import { LoginButton } from "../../components/LoginButton";

const Layout = () => {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const regularDecisionDate = new Date("February 1, 2025 00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = regularDecisionDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, []);
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>Bison Buddy</h3>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Virtual ChatBot
                                </NavLink>
                            </li>
                            {/* <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Ask the Bison
                                </NavLink>
                            </li> */}
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/interview" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Virtual Interview
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="https://aka.ms/entgptsearch" target={"_blank"} title="Github repository link">
                                    <img
                                        src={github}
                                        alt="Github logo"
                                        aria-label="Link to github repository"
                                        width="20px"
                                        height="20px"
                                        className={styles.githubLogo}
                                    />
                                </a>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <div className={styles.countdown}>Regular Decision Deadline Countdown: {countdown}</div>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}>Bison AI</h4>
                    {useLogin && <LoginButton />}
                </div>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;

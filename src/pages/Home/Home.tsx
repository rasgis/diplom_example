import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.logoContainer}>
          <img
            src="/logo-stroy.jpg"
            alt="Stroy City Logo"
            className={styles.logo}
          />
        </div>
        <h1 className={styles.title}>Добро пожаловать в Stroy City</h1>
        <p className={styles.subtitle}>
          Лучшие строительные материалы по доступным ценам
        </p>
        <Link to="/catalog" className={styles.ctaButton}>
          Перейти в каталог
        </Link>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>Широкий выбор</h3>
          <p>Большой ассортимент строительных материалов различных категорий</p>
        </div>
        <div className={styles.feature}>
          <h3>Быстрая доставка</h3>
          <p>Доставка по всей стране в кратчайшие сроки</p>
        </div>
        <div className={styles.feature}>
          <h3>Гарантия качества</h3>
          <p>Все товары проходят строгий контроль качества</p>
        </div>
      </section>

      <section className={styles.about}>
        <h2>О нашем магазине</h2>
        <p>
          Мы рады приветствовать вас в Stroy City! Наша компания уже более 10
          лет предоставляет качественные строительные материалы нашим клиентам.
          Мы гордимся тем, что можем предложить вам широкий выбор продукции по
          конкурентным ценам.
        </p>
        <p>
          Наша миссия - сделать покупки строительных материалов максимально
          удобными и приятными для каждого клиента. Мы постоянно работаем над
          улучшением сервиса и расширением ассортимента.
        </p>
      </section>

      <section className={styles.contact}>
        <h2>Свяжитесь с нами</h2>
        <div className={styles.contactInfo}>
          <p>Телефон: +7 (XXX) XXX-XX-XX</p>
          <p>Email: info@stroycity.com</p>
          <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

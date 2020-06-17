import React from 'react';
import { HeaderBar, LinkButtons, loginButton } from '../components';

const title = {
  pageTitle: 'Bibtex',
};

const Home = () => (
  <div className='home-page'>
    <HeaderBar title={title} />
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Bibtex</h1>
          <p className='lead'>Online editor for bibtex references</p>
        </div>
      </div>
    </section>
    <LinkButtons buttonText='Login' buttonStyle={loginButton} link='/login' />
  </div>
);

export default Home;

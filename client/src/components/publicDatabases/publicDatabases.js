import React from 'react';
import { Link, Redirect } from 'react-router-dom';

const PublicDatabases = () => (
  <ul>
    <li>
      <a href='https://www.scopus.com/'>Scopus</a>
    </li>
    <li>
      <a href='http://login.webofknowledge.com/error/Error?Error=IPError&PathInfo=%2F&RouterURL=http%3A%2F%2Fwww.webofknowledge.com%2F&Domain=.webofknowledge.com&Src=IP&Alias=WOK5'>
        Web of Science
      </a>
    </li>
    <li>
      <a href='https://pubmed.ncbi.nlm.nih.gov/'>PubMed</a>
    </li>
    <li>
      <a href='https://eric.ed.gov/'>ERIC</a>
    </li>
    <li>
      <a href='https://ieeexplore.ieee.org/Xplore/home.jsp'>IEEE Xplore</a>
    </li>
    <li>
      <a href='https://www.sciencedirect.com/'>ScienceDirect</a>
    </li>
    <li>
      <a href='https://doaj.org/'>Directory of Open Access Journals (DOAJ)</a>
    </li>
    <li>
      <a href='https://www.jstor.org/'>JSTOR</a>
    </li>
    <li>
      <a href='https://scholar.google.com/'>Google Scholar</a>
    </li>
  </ul>
);

export default PublicDatabases;

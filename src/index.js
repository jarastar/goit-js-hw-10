import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

function cleanMarkup(ref) {
  ref.innerHTML = '';
}

function inputHandler(e) {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then(function(data) {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(function(err) {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkup(data) {
  if (data.length === 1) {
    cleanMarkup(countryList);
    const markupInfo = createInfoMarkup(data);
    countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfo);
    const markupList = createListMarkup(data);
    countryList.innerHTML = markupList;
  }
}

function createListMarkup(data) {
  return data
    .map(function(country) {
      return (
        '<li><img src="' +
        country.flags.png +
        '" alt="' +
        country.name.official +
        '" width="60" height="40">' +
        country.name.official +
        '</li>'
      );
    })
    .join('');
}

function createInfoMarkup(data) {
  return data
    .map(function(country) {
      return (
        '<img src="' +
        country.flags.svg +
        '" alt="' +
        country.name.official +
        '" width="200" height="100">' +
        '<h1>' +
        country.name.official +
        '</h1>' +
        '<p>Capital: ' +
        country.capital +
        '</p>' +
        '<p>Population: ' +
        country.population +
        '</p>' +
        '<p>Languages: ' +
        Object.values(country.languages) +
        '</p>'
      );
    })
    .join('');
}

searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
